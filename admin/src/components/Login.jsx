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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Admin Login
        </h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-gray-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition duration-200 placeholder-gray-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-gray-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition duration-200 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 active:scale-95 transition-all duration-200"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 Admin Panel
        </p>
      </div>
    </div>
  );
};

export default Login;