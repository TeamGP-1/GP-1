import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { ThemeContext } from "../context/ThemeContext";

export default function GameLobby() {
  const navigate = useNavigate();
  const { currentTheme, theme } = useContext(ThemeContext);
  const styles = theme[currentTheme];

  return (
    <div
      className={`pt-24 min-h-screen ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      } flex items-center justify-center p-4`}
    >
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1
            className={`text-7xl font-bold ${styles.textColor} animate-pulse mb-4`}
          >
            ⚔️ Typing Warrior
          </h1>
          <p
            className={`text-2xl ${
              currentTheme === "dark" ? "text-blue-200" : "text-gray-700"
            } mb-8`}
          >
            Bertarung dengan kecepatan mengetikmu!
          </p>
          <div
            className={`flex justify-center gap-4 ${
              currentTheme === "dark" ? "text-white/60" : "text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-green-400">●</span>
              <span>Multiplayer Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">●</span>
              <span>Pertempuran Real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">●</span>
              <span>Teks dari AI</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Create Room Card */}
          <div
            onClick={() => navigate("/game/create")}
            className={`${
              currentTheme === "dark"
                ? "bg-gray-800/50 border-gray-700/50 hover:border-green-400/50"
                : "bg-white/80 border-gray-300/50 hover:border-green-500/50"
            } backdrop-blur-lg rounded-3xl p-10 border transition-all cursor-pointer group hover:scale-105 hover:shadow-2xl`}
          >
            <div className="text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h2 className={`text-4xl font-bold ${styles.textColor} mb-3`}>
                Buat Room
              </h2>
              <p
                className={`${
                  currentTheme === "dark" ? "text-blue-200" : "text-gray-700"
                } text-lg mb-6`}
              >
                Mulai pertempuran mengetik baru
              </p>
              <div
                className={`space-y-2 ${
                  currentTheme === "dark" ? "text-white/70" : "text-gray-600"
                } text-sm`}
              >
                <p>• Generate ID Room unik</p>
                <p>• Tunggu pemain bergabung</p>
                <p>• Mulai saat siap</p>
              </div>
              <div
                className={`mt-6 ${
                  currentTheme === "dark"
                    ? "bg-green-500/20 border-green-500/30"
                    : "bg-green-100 border-green-300"
                } rounded-xl p-4 border`}
              >
                <p
                  className={`${
                    currentTheme === "dark"
                      ? "text-green-300"
                      : "text-green-700"
                  } font-semibold`}
                >
                  🎮 Anda akan jadi Host
                </p>
              </div>
            </div>
          </div>

          {/* Join Room Card */}
          <div
            onClick={() => navigate("/game/join")}
            className={`${
              currentTheme === "dark"
                ? "bg-gray-800/50 border-gray-700/50 hover:border-purple-400/50"
                : "bg-white/80 border-gray-300/50 hover:border-purple-500/50"
            } backdrop-blur-lg rounded-3xl p-10 border transition-all cursor-pointer group hover:scale-105 hover:shadow-2xl`}
          >
            <div className="text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h2 className={`text-4xl font-bold ${styles.textColor} mb-3`}>
                Gabung Room
              </h2>
              <p
                className={`${
                  currentTheme === "dark" ? "text-purple-200" : "text-gray-700"
                } text-lg mb-6`}
              >
                Bergabung ke pertempuran yang ada
              </p>
              <div
                className={`space-y-2 ${
                  currentTheme === "dark" ? "text-white/70" : "text-gray-600"
                } text-sm`}
              >
                <p>• Masukkan ID Room dari host</p>
                <p>• Tunggu game dimulai</p>
                <p>• Bertarung dan menang!</p>
              </div>
              <div
                className={`mt-6 ${
                  currentTheme === "dark"
                    ? "bg-purple-500/20 border-purple-500/30"
                    : "bg-purple-100 border-purple-300"
                } rounded-xl p-4 border`}
              >
                <p
                  className={`${
                    currentTheme === "dark"
                      ? "text-purple-300"
                      : "text-purple-700"
                  } font-semibold`}
                >
                  🚀 Gabung Pertempuran
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div
          className={`${
            currentTheme === "dark"
              ? "bg-gray-800/30 border-gray-700/30"
              : "bg-white/50 border-gray-300/30"
          } backdrop-blur rounded-2xl p-8 border`}
        >
          <h3
            className={`text-2xl font-bold ${styles.textColor} mb-4 text-center`}
          >
            📚 Cara Bermain
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div
              className={`${
                currentTheme === "dark" ? "bg-gray-700/30" : "bg-gray-100/50"
              } rounded-xl p-4`}
            >
              <div className="text-3xl mb-2">1️⃣</div>
              <p
                className={`${
                  currentTheme === "dark" ? "text-white/80" : "text-gray-700"
                } text-sm`}
              >
                Buat atau Gabung Room
              </p>
            </div>
            <div
              className={`${
                currentTheme === "dark" ? "bg-gray-700/30" : "bg-gray-100/50"
              } rounded-xl p-4`}
            >
              <div className="text-3xl mb-2">2️⃣</div>
              <p
                className={`${
                  currentTheme === "dark" ? "text-white/80" : "text-gray-700"
                } text-sm`}
              >
                Tunggu Pemain
              </p>
            </div>
            <div
              className={`${
                currentTheme === "dark" ? "bg-gray-700/30" : "bg-gray-100/50"
              } rounded-xl p-4`}
            >
              <div className="text-3xl mb-2">3️⃣</div>
              <p
                className={`${
                  currentTheme === "dark" ? "text-white/80" : "text-gray-700"
                } text-sm`}
              >
                Ketik Teks dengan Benar
              </p>
            </div>
            <div
              className={`${
                currentTheme === "dark" ? "bg-gray-700/30" : "bg-gray-100/50"
              } rounded-xl p-4`}
            >
              <div className="text-3xl mb-2">4️⃣</div>
              <p
                className={`${
                  currentTheme === "dark" ? "text-white/80" : "text-gray-700"
                } text-sm`}
              >
                Yang Pertama Selesai Menang!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className={`${
              currentTheme === "dark"
                ? "text-white/70 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors text-lg`}
          >
            ← Kembali ke Home
          </button>
        </div>
      </div>
    </div>
  );
}
