import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatINR } from "../utils/currency.js";

const ProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = async (query = search) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/products", {
        params: { limit: 250, search: query || undefined }
      });
      setProducts(data.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setActionId(id);
    setMessage("");
    setError("");
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted successfully.");
      await loadProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to delete product.");
    } finally {
      setActionId("");
    }
  };

  const onSearch = async (event) => {
    event.preventDefault();
    await loadProducts(search.trim());
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Products</h1>
        <Link to="/products/create" className="btn-primary">
          Create Product
        </Link>
      </div>

      <form onSubmit={onSearch} className="panel-card flex flex-wrap gap-3 p-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="input flex-1"
          placeholder="Search by product name"
        />
        <button type="submit" className="btn-secondary">
          Search
        </button>
      </form>

      {message && <p className="rounded-xl bg-emerald-100 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : (
        <div className="panel-card overflow-x-auto p-2">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#fff1e4] text-left text-[#70645c]">
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Featured</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-[#f3dfce]">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-semibold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{product.category}</td>
                  <td className="px-3 py-2">{formatINR(product.price)}</td>
                  <td className="px-3 py-2">{product.stock}</td>
                  <td className="px-3 py-2">{product.featured ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/products/edit/${product._id}`} className="btn-secondary !py-1 !px-3 text-xs">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700"
                        onClick={() => onDelete(product._id)}
                        disabled={actionId === product._id}
                      >
                        {actionId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-[#80746c]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProductsPage;

