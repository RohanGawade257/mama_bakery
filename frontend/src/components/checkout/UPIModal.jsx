import { motion, AnimatePresence } from "framer-motion";
import { formatINR } from "../../utils/currency.js";

const UPIModal = ({ open, onClose, onConfirm, settings, amount, loading }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f2722]/45 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flame-card w-full max-w-lg p-5 sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl text-[#4a4039]">Complete UPI Payment</h3>
              <p className="mt-1 text-sm text-[#74665d]">
                Amount: <span className="font-bold text-[#FF6B00]">{formatINR(amount)}</span>
              </p>
            </div>
            <button type="button" className="outline-button !px-3 !py-1.5 text-sm" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[170px,1fr]">
            <div className="overflow-hidden rounded-2xl border border-[#ffd6ba] bg-white p-2">
              {settings?.qrImage ? (
                <img src={settings.qrImage} alt="UPI QR" className="h-40 w-full rounded-xl object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl bg-[#fff4ec] text-sm text-[#8f8278]">
                  QR not uploaded
                </div>
              )}
            </div>
            <div className="space-y-2 text-sm text-[#6f6158]">
              <p>
                <span className="font-semibold text-[#4a4039]">UPI ID:</span> {settings?.upiId || "Not set"}
              </p>
              <p>
                <span className="font-semibold text-[#4a4039]">Phone:</span> {settings?.phone || "Not set"}
              </p>
              <p className="rounded-xl bg-[#fff4ec] p-3">{settings?.instructions}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="flame-button w-full"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "I have completed payment"}
            </button>
            <button type="button" className="outline-button w-full" onClick={onClose}>
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default UPIModal;
