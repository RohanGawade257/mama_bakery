import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatINR } from "../utils/currency.js";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [productTotal, setProductTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/products", { params: { page: 1, limit: 1 } }),
          api.get("/orders")
        ]);
        setProductTotal(productsRes.data?.meta?.total || 0);
        setOrders(ordersRes.data?.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pending = orders.filter((order) => order.orderStatus === "Pending").length;

    return { totalOrders, revenue, pending };
  }, [orders]);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <section className="space-y-5">
      <h1 className="page-title">Dashboard</h1>
      {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel-card p-4">
          <p className="text-xs text-[#8b7f75]">Total Products</p>
          <p className="mt-1 text-2xl font-bold">{productTotal}</p>
        </div>
        <div className="panel-card p-4">
          <p className="text-xs text-[#8b7f75]">Total Orders</p>
          <p className="mt-1 text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="panel-card p-4">
          <p className="text-xs text-[#8b7f75]">Revenue</p>
          <p className="mt-1 text-2xl font-bold">{formatINR(stats.revenue)}</p>
        </div>
        <div className="panel-card p-4">
          <p className="text-xs text-[#8b7f75]">Pending Orders</p>
          <p className="mt-1 text-2xl font-bold">{stats.pending}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl">Recent Orders</h2>
            <Link to="/orders" className="text-sm font-semibold text-[#e76000]">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="rounded-xl border border-[#f2decd] bg-white p-3">
                <p className="font-semibold">{order._id}</p>
                <p className="text-sm text-[#6e625b]">{order.orderStatus}</p>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-[#7f736a]">No orders found.</p>}
          </div>
        </div>

        <div className="panel-card p-5">
          <h2 className="text-2xl">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/products/create" className="btn-primary">
              Create Product
            </Link>
            <Link to="/products" className="btn-secondary">
              Manage Products
            </Link>
            <Link to="/settings" className="btn-secondary">
              UPI Settings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

