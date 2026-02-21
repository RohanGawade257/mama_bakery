import { useEffect, useState } from "react";
import api from "../api/client.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    upiId: "",
    phone: "",
    instructions: "",
    qrImage: ""
  });
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/settings");
        const upi = data.data?.upi || {};
        setSettings({
          enabled: Boolean(upi.enabled),
          upiId: upi.upiId || "",
          phone: upi.phone || "",
          instructions: upi.instructions || "",
          qrImage: upi.qrImage || ""
        });
        setQrPreview(upi.qrImage || "");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(
    () => () => {
      if (qrPreview.startsWith("blob:")) {
        URL.revokeObjectURL(qrPreview);
      }
    },
    [qrPreview]
  );

  const updateField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const onSelectQr = (event) => {
    const file = event.target.files?.[0] || null;
    setQrFile(file);
    if (file) {
      if (qrPreview.startsWith("blob:")) {
        URL.revokeObjectURL(qrPreview);
      }
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("enabled", String(settings.enabled));
      formData.append("upiId", settings.upiId.trim());
      formData.append("phone", settings.phone.trim());
      formData.append("instructions", settings.instructions.trim());
      if (qrFile) {
        formData.append("qrImage", qrFile);
      }

      const { data } = await api.put("/settings", formData);
      const upi = data.data?.upi || {};
      setSettings({
        enabled: Boolean(upi.enabled),
        upiId: upi.upiId || "",
        phone: upi.phone || "",
        instructions: upi.instructions || "",
        qrImage: upi.qrImage || ""
      });
      setQrPreview(upi.qrImage || qrPreview);
      setQrFile(null);
      setMessage("Settings updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading settings..." />;
  }

  return (
    <section className="space-y-5">
      <h1 className="page-title">UPI Settings</h1>

      {message && <p className="rounded-xl bg-emerald-100 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

      <form className="panel-card space-y-4 p-5" onSubmit={onSubmit}>
        <label className="flex items-center gap-2 text-sm font-semibold text-[#5f554e]">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(event) => updateField("enabled", event.target.checked)}
          />
          Enable UPI Payments
        </label>

        <input
          value={settings.upiId}
          onChange={(event) => updateField("upiId", event.target.value)}
          className="input"
          placeholder="UPI ID"
          required={settings.enabled}
        />

        <input
          value={settings.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          className="input"
          placeholder="Phone Number"
        />

        <textarea
          value={settings.instructions}
          onChange={(event) => updateField("instructions", event.target.value)}
          className="textarea"
          rows={4}
          placeholder="Checkout instructions"
        />

        <div className="space-y-2">
          <label className="btn-secondary inline-flex cursor-pointer">
            Upload QR Code
            <input type="file" accept="image/*" className="hidden" onChange={onSelectQr} />
          </label>
          {qrPreview && (
            <img
              src={qrPreview}
              alt="UPI QR Preview"
              className="h-52 w-52 rounded-xl border border-[#f0dbc9] object-cover"
            />
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
};

export default SettingsPage;
