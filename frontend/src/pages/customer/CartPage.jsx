import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { formatINR } from "../../utils/currency.js";

const CartPage = () => {
  const { items, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const deliveryFee = subtotal > 0 ? 49 : 0;
  const total = subtotal + deliveryFee;

  return (
    <PageContainer>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title text-[#4a4039]">Your Cart</h1>
        {items.length > 0 && (
          <button type="button" className="outline-button" onClick={clearCart}>
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flame-card p-8 text-center">
          <p className="text-[#7b6d63]">Your cart is empty.</p>
          <Link to="/shop" className="flame-button mt-5 inline-flex">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flame-card grid gap-4 p-4 sm:grid-cols-[88px,1fr,auto]">
                <img src={item.image} alt={item.name} className="h-22 w-22 rounded-xl object-cover" />
                <div>
                  <h3 className="font-semibold text-[#4a4039]">{item.name}</h3>
                  <p className="text-sm text-[#7f7065]">{item.category}</p>
                  <p className="mt-1 font-semibold text-[#FF6B00]">{formatINR(item.price)}</p>
                </div>
                <div className="flex min-w-[120px] flex-col gap-2">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(Number(item.stock) || 1, 1)}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item._id, event.target.value)}
                    className="input-field !py-2 text-sm"
                  />
                  <button
                    type="button"
                    className="text-sm font-semibold text-rose-600"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="flame-card h-fit p-5">
            <h2 className="text-xl text-[#4a4039]">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-[#6d6158]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatINR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-[#f3ddcb] pt-2 text-base font-bold text-[#4a4039]">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="flame-button mt-5 block text-center">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="outline-button mt-3 block text-center">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </PageContainer>
  );
};

export default CartPage;

