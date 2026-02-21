import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await login({ email, password });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    const redirectTo = location.state?.from || "/";
    navigate(redirectTo, { replace: true });
  };

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-lg flame-card p-6 sm:p-8">
        <h1 className="page-title text-[#4a4039]">Sign In</h1>
        <p className="mt-2 text-[#7c6f65]">Access your profile, cart, and orders.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="input-field"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="input-field"
            required
          />

          {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" className="flame-button w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-[#74675f]">
          New customer?{" "}
          <Link to="/signup" className="font-semibold text-[#FF6B00]">
            Create an account
          </Link>
        </p>
      </div>
    </PageContainer>
  );
};

export default SignInPage;

