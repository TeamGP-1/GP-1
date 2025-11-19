import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import socket from "../socket/socket";
import { showError, showSuccess } from "../components/toastUI";
import { ThemeContext } from "../context/ThemeContext";

export default function CreateRoom() {
  const navigate = useNavigate();
  const { currentTheme, theme } = useContext(ThemeContext);
  const styles = theme[currentTheme];
  const [playerName, setPlayerName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      showError("Masukkan nama player!");
      return;
    }

    const newRoomId = `ROOM-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;
    setIsCreating(true);

    socket.connect();

    socket.emit("createRoom", {
      playerName: playerName.trim(),
      roomId: newRoomId,
    });

    socket.once("roomCreated", (data) => {
      showSuccess(`Room ${newRoomId} berhasil dibuat!`);
      navigate(`/game/room/${newRoomId}`, {
        state: { playerName: playerName.trim(), isHost: true },
      });
      setIsCreating(false);
    });

    socket.once("error", (data) => {
      showError(data.message);
      setIsCreating(false);
      socket.disconnect();
    });
  };

  return (
    <div
      className={`pt-24 min-h-screen ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-green-50 via-blue-50 to-teal-50"
      } flex items-center justify-center p-4`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/game")}
            className={`${
              currentTheme === "dark"
                ? "text-white/70 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors mb-4 inline-flex items-center gap-2`}
          >
            ← Kembali
          </button>
          <h1 className={`text-5xl font-bold ${styles.textColor} mb-4`}>
            ⚔️ Typing Warrior
          </h1>
        </div>

        <div
          className={`${styles.cardBg} ${
            currentTheme === "dark"
              ? "border-gray-700/50"
              : "border-gray-300/50"
          } backdrop-blur-lg rounded-3xl p-8 border`}
        >
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl">
              ✨
            </div>
            <h2 className={`text-3xl font-bold ${styles.textColor} mb-2`}>
              Buat Room Baru
            </h2>
            <p
              className={
                currentTheme === "dark" ? "text-blue-200" : "text-gray-700"
              }
            >
              Mulai pertempuran mengetik baru
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`block ${styles.textColor} font-medium mb-2`}>
                Nama Anda
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
                className={`w-full px-4 py-3 rounded-xl ${
                  styles.inputBg
                } border focus:outline-none focus:border-blue-400 ${
                  currentTheme === "dark"
                    ? "placeholder-gray-400"
                    : "placeholder-gray-500"
                }`}
                placeholder="Masukkan nama warrior Anda"
                maxLength={20}
                autoFocus
              />
              <p
                className={`${
                  currentTheme === "dark" ? "text-white/50" : "text-gray-500"
                } text-sm mt-2`}
              >
                ID Room akan dibuat otomatis
              </p>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Membuat...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🎮 Buat Room
                </span>
              )}
            </button>

            <div
              className={`text-center pt-4 border-t ${
                currentTheme === "dark"
                  ? "border-gray-700/50"
                  : "border-gray-300/50"
              }`}
            >
              <p
                className={
                  currentTheme === "dark"
                    ? "text-white/70"
                    : "text-gray-600 mb-3"
                }
              >
                Ingin bergabung ke room yang sudah ada?
              </p>
              <button
                onClick={() => navigate("/game/join")}
                className={`${
                  currentTheme === "dark"
                    ? "text-blue-300 hover:text-blue-100"
                    : "text-blue-600 hover:text-blue-800"
                } font-semibold transition-colors`}
              >
                Gabung Room →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div
            className={`${
              currentTheme === "dark"
                ? "bg-gray-800/30 border-gray-700/30"
                : "bg-white/50 border-gray-300/30"
            } backdrop-blur rounded-xl p-4 border`}
          >
            <p
              className={`${
                currentTheme === "dark" ? "text-white/60" : "text-gray-600"
              } text-sm`}
            >
              💡 <strong>Tips:</strong> Bagikan ID Room Anda dengan teman untuk
              bermain bersama!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
