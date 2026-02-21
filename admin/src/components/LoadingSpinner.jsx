const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10">
    <span className="h-9 w-9 animate-spin rounded-full border-4 border-[#ffd7b9] border-t-[#e76000]" />
    <p className="text-sm text-[#7b6f66]">{label}</p>
  </div>
);

export default LoadingSpinner;

