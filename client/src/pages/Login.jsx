import { useState } from "react";
import API from "../services/api"; // ✅ CHANGED
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await API.post("/auth/login", formData); // ✅ CHANGED
      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <Toaster />

      {/* BACKGROUND GLOW */}
      <div className="absolute w-80 h-80 bg-blue-500 opacity-20 blur-[120px] rounded-full -top-32 -left-32"></div>
      <div className="absolute w-80 h-80 bg-purple-500 opacity-20 blur-[120px] rounded-full -bottom-32 -right-32"></div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl max-h-[calc(100vh-2rem)] bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl relative z-10"
      >

        {/* LEFT PANEL */}
        <div className="p-6 lg:p-10 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
            Login
          </h1>
          <p className="text-slate-400 mb-8">
            See your growth and manage your team efficiently.
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white block mb-3">Email*</label>
              <input
                type="email"
                name="email"
                placeholder="mail@website.com"
                onChange={handleChange}
                className="w-full bg-transparent border border-slate-600 rounded-full py-3 px-5 text-white outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-white block mb-3">Password*</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                onChange={handleChange}
                className="w-full bg-transparent border border-slate-600 rounded-full py-3 px-5 text-white outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-3 rounded-full text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-indigo-500/30"
            >
              Login
            </button>
          </form>

          {/* SIGNUP LINK */}
          <p className="text-slate-400 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Sign Up
            </Link>
          </p>

          {/* FOOTER */}
          <p className="text-slate-500 mt-10">
            ©2026 Ethara Ai Task Manager. All rights reserved.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden">

          {/* GLOW EFFECTS */}
          <div className="absolute w-56 h-56 bg-blue-500 opacity-20 blur-[100px] rounded-full top-10"></div>
          <div className="absolute w-56 h-56 bg-purple-500 opacity-20 blur-[100px] rounded-full bottom-10"></div>

          {/* FLOATING SHAPES */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-44 h-44 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-12 shadow-2xl"
          ></motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute w-28 h-28 bg-slate-800 rounded-2xl -top-8 left-12 rotate-12"
          ></motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute w-24 h-24 bg-slate-700 rounded-2xl bottom-14 right-14 -rotate-12"
          ></motion.div>
        </div>

      </motion.div>
    </div>
  );
}

export default Login;