const palette = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-orange-100 text-orange-700",
  Preparing: "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-cyan-100 text-cyan-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-rose-100 text-rose-700",
  Paid: "bg-emerald-100 text-emerald-700",
  "Pending Verification": "bg-amber-100 text-amber-700",
  Failed: "bg-rose-100 text-rose-700",
  Refunded: "bg-violet-100 text-violet-700"
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${palette[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>
);

export default StatusBadge;

