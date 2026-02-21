import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" }
];

const linkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? "text-[#FF6B00]" : "text-[#6b625c] hover:text-[#FF6B00]"
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#ffd9be] bg-white/90 backdrop-blur-md">
      <nav className="container-shell flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FFA559] text-white">
            M
          </span>
          <div>
            <p className="font-bold text-[#FF6B00]">Mama-Bakery</p>
            <p className="text-xs text-[#8a7c71]">Freshly Crafted Daily</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart" className="outline-button !px-4">
            Cart ({totalItems})
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/signin" className="text-sm font-semibold text-[#6b625c] hover:text-[#FF6B00]">
                Sign In
              </Link>
              <Link to="/signup" className="flame-button text-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/orders" className="text-sm font-semibold text-[#6b625c] hover:text-[#FF6B00]">
                Orders
              </Link>
              <Link to="/profile" className="text-sm font-semibold text-[#6b625c] hover:text-[#FF6B00]">
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              <button type="button" onClick={onLogout} className="outline-button text-sm">
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md border border-[#ffd9be] px-3 py-2 text-sm font-semibold text-[#6b625c] md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-shell pb-4 md:hidden"
        >
          <div className="flame-card flex flex-col gap-3 p-4">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="outline-button text-center">
              Cart ({totalItems})
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/signin" onClick={() => setOpen(false)} className="outline-button text-center">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="flame-button text-center">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/orders" onClick={() => setOpen(false)} className="outline-button text-center">
                  Orders
                </Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="outline-button text-center">
                  Profile
                </Link>
                <button type="button" onClick={onLogout} className="flame-button">
                  Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
