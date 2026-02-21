import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  featured: false
};

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!isEdit) return;
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/products/${id}`);
        const product = data.data;
        setForm({
          name: product.name || "",
          description: product.description || "",
          category: product.category || "",
          price: String(product.price ?? ""),
          stock: String(product.stock ?? ""),
          image: product.image || "",
          featured: Boolean(product.featured)
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEdit]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "mama-bakery/products");
      const { data } = await api.post("/upload", formData);
      setForm((prev) => ({ ...prev, image: data.data?.url || "" }));
      setMessage("Image uploaded successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim(),
        featured: Boolean(form.featured)
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      navigate("/products", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading product..." />;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">{isEdit ? "Edit Product" : "Create Product"}</h1>
        <Link to="/products" className="btn-secondary">
          Back to Products
        </Link>
      </div>

      {message && <p className="rounded-xl bg-emerald-100 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

      <form className="panel-card space-y-4 p-5" onSubmit={onSubmit}>
        <input
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="input"
          placeholder="Product name"
          required
        />

        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="textarea"
          placeholder="Description"
          rows={4}
          required
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="input"
            placeholder="Category"
            required
          />
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="input"
            placeholder="Price"
            required
          />
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => updateField("stock", event.target.value)}
            className="input"
            placeholder="Stock"
            required
          />
          <label className="flex items-center gap-2 rounded-xl border border-[#efd4c0] bg-white px-4">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => updateField("featured", event.target.checked)}
            />
            Featured Product
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr,auto]">
          <input
            type="url"
            value={form.image}
            onChange={(event) => updateField("image", event.target.value)}
            className="input"
            placeholder="Image URL"
            required
          />
          <label className="btn-secondary cursor-pointer text-center">
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {form.image && (
          <img src={form.image} alt="Preview" className="h-48 w-full rounded-xl border border-[#efd9c7] object-cover" />
        )}

        <button type="submit" className="btn-primary" disabled={saving || uploading}>
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </section>
  );
};

export default ProductFormPage;
