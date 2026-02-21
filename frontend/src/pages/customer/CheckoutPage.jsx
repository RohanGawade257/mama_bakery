import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client.js";
import PageContainer from "../../components/layout/PageContainer.jsx";
import UPIModal from "../../components/checkout/UPIModal.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { formatINR } from "../../utils/currency.js";

const initialAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  notes: ""
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { createOrder, submitting } = useOrders();

  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddress,
    fullName: user?.name || ""
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentNote, setPaymentNote] = useState("");
  const [error, setError] = useState("");
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiSettings, setUpiSettings] = useState(null);

  const deliveryFee = useMemo(() => (subtotal > 0 ? 49 : 0), [subtotal]);
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const loadUpiSettings = async () => {
      try {
        const { data } = await api.get("/settings/public");
        setUpiSettings(data.data?.upi || null);
      } catch (_error) {
        setUpiSettings(null);
      }
    };

    loadUpiSettings();
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      setUpiModalOpen(false);
    }
  }, [items.length]);

  const updateAddress = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const requiredFields = ["fullName", "phone", "line1", "city", "state", "postalCode"];
    const missing = requiredFields.find((field) => !shippingAddress[field]?.trim());
    if (missing) {
      setError("Please complete all required shipping fields.");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateAddress()) return;
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (paymentMethod === "UPI" && !upiSettings?.enabled) {
      setError("UPI payments are currently unavailable. Please select COD.");
      return;
    }

    setError("");
    const payload = {
      items: items.map((item) => ({
        product: item._id,
        quantity: item.quantity
      })),
      shippingAddress: {
        ...shippingAddress,
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        line1: shippingAddress.line1.trim(),
        line2: shippingAddress.line2.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        notes: shippingAddress.notes.trim()
      },
      paymentMethod,
      deliveryFee,
      paymentMeta: {
        transactionNote: paymentMethod === "UPI" ? paymentNote.trim() : ""
      }
    };

    const result = await createOrder(payload);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    clearCart();
    navigate(`/order-success/${result.data._id}`);
  };

  const onSubmitCheckout = async (event) => {
    event.preventDefault();
    if (paymentMethod === "UPI") {
      if (!validateAddress()) return;
      setUpiModalOpen(true);
      return;
    }
    await placeOrder();
  };

  if (items.length === 0) {
    return (
      <PageContainer>
        <div className="flame-card p-8 text-center">
          <h1 className="page-title text-[#4a4039]">Checkout</h1>
          <p className="mt-2 text-[#7c6f65]">Your cart is empty. Add products before checkout.</p>
          <Link to="/shop" className="flame-button mt-5 inline-flex">
            Go to Shop
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="page-title text-[#4a4039]">Checkout</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,340px]">
        <form className="space-y-5" onSubmit={onSubmitCheckout}>
          <div className="flame-card p-5">
            <h2 className="text-xl text-[#4a4039]">Shipping Address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={shippingAddress.fullName}
                onChange={(event) => updateAddress("fullName", event.target.value)}
                placeholder="Full name *"
                className="input-field"
                required
              />
              <input
                value={shippingAddress.phone}
                onChange={(event) => updateAddress("phone", event.target.value)}
                placeholder="Phone *"
                className="input-field"
                required
              />
              <input
                value={shippingAddress.line1}
                onChange={(event) => updateAddress("line1", event.target.value)}
                placeholder="Address line 1 *"
                className="input-field sm:col-span-2"
                required
              />
              <input
                value={shippingAddress.line2}
                onChange={(event) => updateAddress("line2", event.target.value)}
                placeholder="Address line 2"
                className="input-field sm:col-span-2"
              />
              <input
                value={shippingAddress.city}
                onChange={(event) => updateAddress("city", event.target.value)}
                placeholder="City *"
                className="input-field"
                required
              />
              <input
                value={shippingAddress.state}
                onChange={(event) => updateAddress("state", event.target.value)}
                placeholder="State *"
                className="input-field"
                required
              />
              <input
                value={shippingAddress.postalCode}
                onChange={(event) => updateAddress("postalCode", event.target.value)}
                placeholder="Postal code *"
                className="input-field"
                required
              />
              <textarea
                value={shippingAddress.notes}
                onChange={(event) => updateAddress("notes", event.target.value)}
                placeholder="Delivery notes"
                className="textarea-field sm:col-span-2"
                rows={3}
              />
            </div>
          </div>

          <div className="flame-card p-5">
            <h2 className="text-xl text-[#4a4039]">Payment Method</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2 text-sm text-[#5f544d]">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 text-sm text-[#5f544d]">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                  disabled={!upiSettings?.enabled}
                />
                UPI Payment
              </label>
              {!upiSettings?.enabled && (
                <p className="text-xs text-rose-600">UPI is currently unavailable. Please select COD.</p>
              )}
              {paymentMethod === "UPI" && (
                <textarea
                  value={paymentNote}
                  onChange={(event) => setPaymentNote(event.target.value)}
                  className="textarea-field"
                  rows={3}
                  placeholder="Transaction note (optional)"
                />
              )}
            </div>
          </div>

          {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" className="flame-button" disabled={submitting}>
            {submitting ? "Placing order..." : paymentMethod === "UPI" ? "Continue to UPI" : "Place Order"}
          </button>
        </form>

        <aside className="flame-card h-fit p-5">
          <h2 className="text-xl text-[#4a4039]">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-[#6d6158]">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between gap-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-2 border-t border-[#f3ddcb] pt-2" />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatINR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#4a4039]">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>

      <UPIModal
        open={upiModalOpen}
        onClose={() => setUpiModalOpen(false)}
        onConfirm={placeOrder}
        settings={upiSettings}
        amount={total}
        loading={submitting}
      />
    </PageContainer>
  );
};

export default CheckoutPage;
