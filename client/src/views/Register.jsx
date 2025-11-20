import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { showError, showSuccess } from "../components/toastUI";
import url from "../constant/baseUrl";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  function handleForm(e, inputValue) {
    setFormData((oldValue) => {
      return {
        ...oldValue,
        [inputValue]: e.target.value,
      };
    });
  }

  async function handleRegister(e) {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${url}/register`, formData);
      showSuccess("Registrasi berhasil! Silakan login");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      showError(error.response?.data?.message || "Registrasi gagal");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-black to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            👤
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Daftar Akun</h2>
          <p className="text-purple-100">Buat akun baru Anda</p>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                  👤
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => handleForm(e, "username")}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Masukkan username Anda"
                  required
                />
              </div>
            </div>

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
                  onChange={(e) => handleForm(e, "email")}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="email@example.com"
                  required
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
                  onChange={(e) => handleForm(e, "password")}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Login di sini
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
