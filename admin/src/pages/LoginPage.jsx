import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAdminAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    const result = login(username, password);
    if (!result.ok) {
      setError(result.message || "Invalid credentials");
      return;
    }

    const redirectTo = location.state?.from || "/dashboard";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="shell py-16">
      <div className="mx-auto w-full max-w-md panel-card p-6 sm:p-8">
        <h1 className="page-title">Admin Login</h1>
        <p className="mt-2 text-sm text-[#756960]">
          Use credentials from <code>admin/.env</code>
        </p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="input"
            required
          />

          {error && <p className="rounded-xl bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

