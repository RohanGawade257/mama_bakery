import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext.jsx";
import { formatINR } from "../../utils/currency.js";
import { showToast } from "../ui/ToastHost.jsx";

const ProductCard = ({ product }) => {
  const { addToCart, items } = useCart();
  const isInCart = items.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast("Product added to cart");
  };

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="flame-card overflow-hidden"
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product._id}`} className="block">
        <img src={product.image} alt={product.name} className="h-48 w-full object-cover" loading="lazy" />
      </Link>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#FF6B00]">{product.category}</p>
        <h3 className="mt-1 text-lg text-[#4a4039]">{product.name}</h3>
        <p className="mt-1 text-sm text-[#7a6d63] line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-[#FF6B00]">{formatINR(product.price)}</p>
          <span className="text-xs text-[#86786f]">{product.stock} in stock</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flame-button w-full ${isInCart ? "is-added" : ""}`}
            disabled={product.stock <= 0}
          >
            {isInCart ? "Added \u2713" : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <Link to={`/product/${product._id}`} className="outline-button flex items-center justify-center">
            View
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
