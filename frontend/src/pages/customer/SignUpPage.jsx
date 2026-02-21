import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-lg flame-card p-6 sm:p-8">
        <h1 className="page-title text-[#4a4039]">Create Account</h1>
        <p className="mt-2 text-[#7c6f65]">Join Mama-Bakery and start ordering fresh bakes.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Full name"
            className="input-field"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Email address"
            className="input-field"
            required
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Password"
            className="input-field"
            required
          />
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            placeholder="Confirm password"
            className="input-field"
            required
          />

          {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" className="flame-button w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-[#74675f]">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-[#FF6B00]">
            Sign in
          </Link>
        </p>
      </div>
    </PageContainer>
  );
};

export default SignUpPage;

