const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10">
    <span className="h-9 w-9 animate-spin rounded-full border-4 border-[#ffd2b3] border-t-[#FF6B00]" />
    <p className="text-sm text-[#7f7065]">{label}</p>
  </div>
);

export default LoadingSpinner;
