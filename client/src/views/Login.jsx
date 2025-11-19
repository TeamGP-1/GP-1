import React, { useState, useEffect } from "react";
import { showError, showSuccess } from "../components/toastUI";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";
import url from "../constant/baseUrl";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e, inputValue) => {
    setFormData((oldValue) => {
      return {
        ...oldValue,
        [inputValue]: e.target.value,
      };
    });
  };

  async function handleLogin(e) {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${url}/login`, formData);
      localStorage.setItem("access_token", data.access_token);

      // Decode JWT untuk mendapatkan username
      if (data.access_token) {
        try {
          const payload = JSON.parse(atob(data.access_token.split(".")[1]));
          if (payload.username) {
            localStorage.setItem("username", payload.username);
          }
        } catch (err) {
          console.error("Error parsing token:", err);
        }
      }

      showSuccess("Login berhasil!");
      navigate("/");
    } catch (error) {
      showError(error.response?.data?.message || "Login gagal");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-black flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            🔒
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang</h2>
          <p className="text-blue-100">Login ke akun Anda</p>
        </div>

        <form onSubmit={(e) => handleLogin(e)} className="p-8 space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                📧
              </span>
              <input
                type="email"
                name="email"
                onChange={(e) => handleInputChange(e, "email")}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                🔒
              </span>
              <input
                type="password"
                name="password"
                onChange={(e) => handleInputChange(e, "password")}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
