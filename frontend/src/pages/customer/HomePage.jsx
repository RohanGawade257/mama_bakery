import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../../components/layout/PageContainer.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import { useProducts } from "../../context/ProductContext.jsx";

const highlights = [
  { title: "Baked Fresh Daily", text: "Small-batch production with premium ingredients." },
  { title: "Fast Local Delivery", text: "Reliable doorstep delivery with live order status." },
  { title: "Secure Checkout", text: "UPI and COD options with transparent tracking." }
];

const HomePage = () => {
  const { featuredProducts, fetchFeaturedProducts } = useProducts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      try {
        await fetchFeaturedProducts(4);
      } catch (_error) {
        // no-op: context already handles failures
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, [fetchFeaturedProducts]);

  return (
    <>
      <section className="container-shell pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flame-card relative overflow-hidden p-8 sm:p-12"
        >
          <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-[#ff6b0022]" />
          <div className="absolute -bottom-10 right-20 h-36 w-36 rounded-full bg-[#ffa55933]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.15fr,1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B00]">
                Premium Bakery Experience
              </p>
              <h1 className="page-title mt-3 text-[#473d36]">
                Warm handcrafted bakes, delivered with startup-grade speed.
              </h1>
              <p className="mt-4 max-w-xl text-[#6f6158]">
                Mama-Bakery blends artisanal recipes with modern ordering so every celebration and
                every everyday craving is one click away.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop" className="flame-button">
                  Shop Now
                </Link>
                <Link to="/contact" className="outline-button">
                  Plan Bulk Orders
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#ffd9be] bg-white/90 p-4">
                  <h3 className="font-semibold text-[#4f443d]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#77695f]">{item.text}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-[#ffd9be] bg-gradient-to-br from-[#ff6b00] to-[#ffa559] p-4 text-white">
                <h3 className="font-semibold">UPI Ready</h3>
                <p className="mt-1 text-sm text-white/90">
                  Instant checkout with a streamlined payment confirmation workflow.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <PageContainer>
        <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title text-[#4a4039]">Featured Bestsellers</h2>
            <Link to="/shop" className="text-sm font-semibold text-[#FF6B00]">
              View all products
            </Link>
          </div>
        {loading ? (
          <LoadingSpinner label="Loading featured products..." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default HomePage;
