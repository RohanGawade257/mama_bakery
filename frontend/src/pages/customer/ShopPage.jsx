import { useEffect, useMemo, useState } from "react";
import PageContainer from "../../components/layout/PageContainer.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import { useProducts } from "../../context/ProductContext.jsx";

const ShopPage = () => {
  const { products, categories, fetchProducts, fetchCategories } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };

    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== "All") params.category = category;
      await fetchProducts(params);
      setLoading(false);
    };

    const timer = setTimeout(loadProducts, 250);
    return () => clearTimeout(timer);
  }, [category, fetchProducts, search]);

  const total = useMemo(() => products.length, [products]);

  return (
    <PageContainer>
      <div className="flame-card p-5 sm:p-6">
        <h1 className="page-title text-[#4a4039]">Shop Fresh Bakes</h1>
        <p className="mt-2 text-[#74665d]">
          Find cakes, pastries, cookies and breads crafted for celebrations and daily cravings.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr,220px]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product name..."
            className="input-field"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="select-field">
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#7f7065]">{total} products found</p>
      </div>

        {loading ? (
          <LoadingSpinner label="Loading products..." />
        ) : (
          <>
            {products.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-[#ffd9be] bg-white/90 p-8 text-center text-[#7a6d63]">
                No products found for the selected filters.
              </div>
            ) : (
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </PageContainer>
  );
};

export default ShopPage;
