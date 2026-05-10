import { useState } from "react";
import API from "../services/api"; // ✅ CHANGED
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", formData); // ✅ CHANGED
      toast.success("Account created successfully");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <Toaster />

      {/* BACKGROUND */}
      <div className="absolute w-80 h-80 bg-blue-500 opacity-20 blur-[120px] rounded-full -top-32 -left-32"></div>
      <div className="absolute w-80 h-80 bg-purple-500 opacity-20 blur-[120px] rounded-full -bottom-32 -right-32"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl relative z-10 p-6 lg:p-10"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 text-center">
          Create Account
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Start managing your projects smarter.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-white block mb-3">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full bg-transparent border border-slate-600 rounded-full py-3 px-5 text-white outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-white block mb-3">Email</label>
            <input
              type="email"
              name="email"
              placeholder="mail@website.com"
              onChange={handleChange}
              className="w-full bg-transparent border border-slate-600 rounded-full py-3 px-5 text-white outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-white block mb-3">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              onChange={handleChange}
              className="w-full bg-transparent border border-slate-600 rounded-full py-3 px-5 text-white outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-white block mb-3">Select Role</label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full bg-[#0F172A] border border-slate-600 rounded-full py-3 px-5 text-white outline-none focus:border-blue-500 transition-all"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-3 rounded-full text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-indigo-500/30"
          >
            Create Account
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-slate-400 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>

      </motion.div>
    </div>
  );
}

export default Signup;