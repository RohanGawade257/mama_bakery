import { motion } from "framer-motion";

const PageContainer = ({ children }) => (
  <motion.main
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="container-shell py-8 sm:py-12"
  >
    {children}
  </motion.main>
);

export default PageContainer;
