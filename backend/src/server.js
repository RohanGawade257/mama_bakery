import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { getCloudinaryEnvStatus } from "./config/cloudinary.js";

const PORT = process.env.PORT || 5000;

const logStartupEnvHealth = () => {
  const cloudinaryStatus = getCloudinaryEnvStatus();

  // eslint-disable-next-line no-console
  console.log(
    `[env] cloudinary preferred=${cloudinaryStatus.hasPreferred} legacy=${cloudinaryStatus.hasLegacy} resolved=${cloudinaryStatus.hasResolvedValues}`
  );
};

const startServer = async () => {
  logStartupEnvHealth();
  await connectDB();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
