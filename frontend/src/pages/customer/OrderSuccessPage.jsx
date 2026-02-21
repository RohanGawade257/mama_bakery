import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { formatINR } from "../../utils/currency.js";

const OrderSuccessPage = () => {
  const { id } = useParams();
  const { fetchOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      const result = await fetchOrderById(id);
      if (result.ok) {
        setOrder(result.data);
      }
      setLoading(false);
    };

    loadOrder();
  }, [fetchOrderById, id]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading order details..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flame-card p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#FF6B00]">Order Placed</p>
        <h1 className="page-title mt-2 text-[#4a4039]">Thank you for your order</h1>
        <p className="mt-2 text-[#72655c]">
          Your order reference is <span className="font-semibold">{order?._id || id}</span>.
        </p>

        {order && (
          <div className="mt-6 grid gap-4 rounded-2xl border border-[#f1ddca] bg-white/80 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[#8a7d72]">Order Status</p>
              <div className="mt-1">
                <StatusBadge status={order.orderStatus} />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#8a7d72]">Payment Status</p>
              <div className="mt-1">
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#8a7d72]">Total Paid</p>
              <p className="mt-1 text-lg font-semibold text-[#4a4039]">{formatINR(order.total)}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/orders" className="flame-button">
            View My Orders
          </Link>
          <Link to="/shop" className="outline-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default OrderSuccessPage;

