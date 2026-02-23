import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import { formatINR } from "../../utils/currency.js";
import { useProducts } from "../../context/ProductContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { showToast } from "../../components/ui/ToastHost.jsx";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { activeProduct, fetchProductById, clearActiveProduct, loading, error } = useProducts();
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductById(id);
    return () => clearActiveProduct();
  }, [clearActiveProduct, fetchProductById, id]);

  const maxQuantity = useMemo(() => Math.max(Number(activeProduct?.stock) || 0, 0), [activeProduct]);
  const isInCart = useMemo(
    () => items.some((item) => item._id === activeProduct?._id),
    [items, activeProduct?._id]
  );

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity);
    showToast("Product added to cart");
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading product..." />
      </PageContainer>
    );
  }

  if (!activeProduct) {
    return (
      <PageContainer>
        <div className="flame-card p-8 text-center">
          <h1 className="page-title text-[#4a4039]">Product not found</h1>
          <p className="mt-2 text-[#7a6d63]">{error || "This product may have been removed."}</p>
          <Link to="/shop" className="flame-button mt-5 inline-flex">
            Back to Shop
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flame-card overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          <img
            src={activeProduct.image}
            alt={activeProduct.name}
            className="h-full min-h-[320px] w-full object-cover"
          />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#FF6B00]">
              {activeProduct.category}
            </p>
            <h1 className="mt-2 text-3xl text-[#4a4039]">{activeProduct.name}</h1>
            <p className="mt-4 text-[#71645b]">{activeProduct.description}</p>

            <div className="mt-6 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold text-[#FF6B00]">{formatINR(activeProduct.price)}</p>
              <p className="text-sm text-[#7f7065]">{activeProduct.stock} in stock</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="w-28">
                <label htmlFor="quantity" className="mb-1 block text-xs font-semibold text-[#7f7065]">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={maxQuantity || 1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(Number(event.target.value) || 1, 1))}
                  className="input-field"
                />
              </div>
              <button
                type="button"
                className={`flame-button mt-5 ${isInCart ? "is-added" : ""}`}
                onClick={handleAddToCart}
                disabled={maxQuantity <= 0}
              >
                {isInCart ? "Added \u2713" : maxQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <Link to="/cart" className="outline-button mt-5">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductDetailsPage;
