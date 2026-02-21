import { useEffect, useState } from "react";
import api from "../api/client.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatINR } from "../utils/currency.js";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const PAYMENT_STATUSES = ["Pending", "Pending Verification", "Paid", "Failed", "Refunded"];

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/orders");
      setOrders(data.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrder = async (orderId, payload) => {
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const { data } = await api.put(`/orders/${orderId}`, payload);
      const updated = data.data;
      setOrders((prev) => prev.map((item) => (item._id === orderId ? updated : item)));
      setMessage("Order updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="page-title">Orders</h1>
        <button type="button" className="btn-secondary" onClick={loadOrders}>
          Refresh
        </button>
      </div>

      {message && <p className="rounded-xl bg-emerald-100 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="panel-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a7d74]">Order ID</p>
                  <p className="font-semibold">{order._id}</p>
                  <p className="mt-1 text-sm text-[#6c6058]">
                    {order.user?.name || "Customer"} ({order.user?.email || "N/A"})
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={order.orderStatus} />
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-[#6f635b] sm:grid-cols-4">
                <p>{new Date(order.createdAt).toLocaleString()}</p>
                <p>{order.items.length} item(s)</p>
                <p>{order.paymentMethod}</p>
                <p className="font-semibold">{formatINR(order.total)}</p>
              </div>

              <details className="mt-4 rounded-xl border border-[#f1dece] bg-white p-3">
                <summary className="cursor-pointer text-sm font-semibold text-[#5f554e]">
                  View order details
                </summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7d74]">Items</p>
                    <div className="mt-2 space-y-2 text-sm text-[#6f635b]">
                      {order.items.map((item) => (
                        <p key={`${order._id}-${item.product}`}>
                          {item.name} x {item.quantity} ({formatINR(item.price * item.quantity)})
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7d74]">
                      Shipping Address
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-[#6f635b]">
                      <p>{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.phone}</p>
                      <p>{order.shippingAddress?.line1}</p>
                      {order.shippingAddress?.line2 && <p>{order.shippingAddress?.line2}</p>}
                      <p>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </details>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a7d74]">
                    Update Order Status
                  </label>
                  <select
                    className="select"
                    value={order.orderStatus}
                    onChange={(event) => updateOrder(order._id, { orderStatus: event.target.value })}
                    disabled={submitting}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a7d74]">
                    Update Payment Status
                  </label>
                  <select
                    className="select"
                    value={order.paymentStatus}
                    onChange={(event) => updateOrder(order._id, { paymentStatus: event.target.value })}
                    disabled={submitting}
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))}
          {orders.length === 0 && (
            <div className="panel-card p-8 text-center text-[#7f736b]">No orders found.</div>
          )}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;

