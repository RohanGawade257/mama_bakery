import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { formatINR } from "../../utils/currency.js";

const OrdersPage = () => {
  const { myOrders, loading, fetchMyOrders } = useOrders();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <PageContainer>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="page-title text-[#4a4039]">My Orders</h1>
        <Link to="/shop" className="outline-button">
          Shop more
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading your orders..." />
      ) : myOrders.length === 0 ? (
        <div className="flame-card p-8 text-center text-[#7b6e64]">You have not placed any orders yet.</div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <article key={order._id} className="flame-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a7e73]">Order ID</p>
                  <p className="font-semibold text-[#4a4039]">{order._id}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={order.orderStatus} />
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-sm text-[#6f6259] sm:grid-cols-3">
                <p>{order.items.length} item(s)</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
                <p className="font-semibold text-[#4a4039]">{formatINR(order.total)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default OrdersPage;

