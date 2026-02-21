import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/settings", label: "Settings" }
];

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen pb-10">
      <header className="border-b border-[#efd7c5] bg-white/90 backdrop-blur-md">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link to="/dashboard" className="font-bold text-[#e76000]">
            Mama-Bakery Admin
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 text-sm font-semibold ${
                    isActive ? "bg-[#e76000] text-white" : "bg-[#fff2e7] text-[#6c6159]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button type="button" className="btn-secondary !py-1 !px-3 text-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="shell py-7">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

