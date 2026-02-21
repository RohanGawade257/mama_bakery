import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "global",
      unique: true
    },
    upi: {
      enabled: { type: Boolean, default: true },
      upiId: { type: String, default: "" },
      phone: { type: String, default: "" },
      qrImage: { type: String, default: "" },
      instructions: {
        type: String,
        default:
          "Pay using UPI, then click 'I have completed payment'. Your order will be verified by our team."
      }
    }
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
