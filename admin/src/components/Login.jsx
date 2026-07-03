import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(
        backendUrl + "/api/user/admin",
        { email, password }
      );

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful 🚀");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-admin-border bg-admin-surface p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-8 text-center">
          <p className="section-title">Secure access</p>
          <h1 className="mt-2 text-3xl font-semibold text-admin-text">Admin Login</h1>
          <p className="mt-2 text-sm text-admin-muted">Access the operations dashboard with your credentials.</p>
        </div>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-admin-text">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-2xl border border-admin-border bg-admin-surface-muted px-4 py-3 text-admin-text placeholder:text-admin-muted"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-admin-text">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-admin-border bg-admin-surface-muted px-4 py-3 text-admin-text placeholder:text-admin-muted"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-admin-accent px-4 py-3 font-semibold text-admin-accent-contrast transition hover:opacity-90"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-admin-muted">© 2026 Admin Panel</p>
      </div>
    </div>
  );
};

export default Login;