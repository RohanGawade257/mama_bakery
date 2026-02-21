import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-14 border-t border-[#ffd9be] bg-white/95">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-xl text-[#FF6B00]">Mama-Bakery</h3>
          <p className="mt-2 text-sm text-[#6b625c]">
            Premium handcrafted bakery delights with modern online ordering.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[#4a4039]">Quick Links</h4>
          <div className="mt-2 flex flex-col gap-1 text-sm text-[#6b625c]">
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/orders">My Orders</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#4a4039]">Contact</h4>
          <p className="mt-2 text-sm text-[#6b625c]">Panaji, Goa</p>
          <p className="text-sm text-[#6b625c]">+91 98765 43210</p>
          <p className="text-sm text-[#6b625c]">hello@mama-bakery.com</p>
        </div>
      </div>
      <p className="border-t border-[#ffe7d5] py-3 text-center text-xs text-[#8a7c71]">
        (c) {new Date().getFullYear()} Mama-Bakery. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
