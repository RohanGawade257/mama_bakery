import PageContainer from "../../components/layout/PageContainer.jsx";

const galleryItems = [
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80"
];

const GalleryPage = () => (
  <PageContainer>
    <div className="mb-5">
      <h1 className="page-title text-[#4a4039]">Bakery Gallery</h1>
      <p className="mt-2 text-[#7a6d63]">A quick look at our signature cakes, pastries and breads.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryItems.map((src) => (
        <div key={src} className="flame-card overflow-hidden">
          <img src={src} alt="Mama-Bakery showcase" className="h-60 w-full object-cover" loading="lazy" />
        </div>
      ))}
    </div>
  </PageContainer>
);

export default GalleryPage;

