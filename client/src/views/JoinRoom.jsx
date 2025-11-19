import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import socket from "../socket/socket";
import { showError, showSuccess } from "../components/toastUI";
import { ThemeContext } from "../context/ThemeContext";

export default function JoinRoom() {
  const navigate = useNavigate();
  const { currentTheme, theme } = useContext(ThemeContext);
  const styles = theme[currentTheme];
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      showError("Masukkan nama player!");
      return;
    }

    if (!roomId.trim()) {
      showError("Masukkan Room ID!");
      return;
    }

    setIsJoining(true);
    socket.connect();

    socket.emit("joinRoom", {
      playerName: playerName.trim(),
      roomId: roomId.trim().toUpperCase(),
    });

    socket.once("playerJoined", (data) => {
      showSuccess("Berhasil join room!");
      navigate(`/game/room/${roomId.trim().toUpperCase()}`, {
        state: { playerName: playerName.trim(), isHost: false },
      });
      setIsJoining(false);
    });

    socket.once("error", (data) => {
      showError(data.message);
      setIsJoining(false);
      socket.disconnect();
    });
  };

  return (
    <div
      className={`pt-24 min-h-screen ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50"
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
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl">
              🎯
            </div>
            <h2 className={`text-3xl font-bold ${styles.textColor} mb-2`}>
              Gabung Room
            </h2>
            <p
              className={
                currentTheme === "dark" ? "text-purple-200" : "text-gray-700"
              }
            >
              Bergabung ke pertempuran yang ada
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
                className={`w-full px-4 py-3 rounded-xl ${
                  styles.inputBg
                } border focus:outline-none focus:border-purple-400 ${
                  currentTheme === "dark"
                    ? "placeholder-gray-400"
                    : "placeholder-gray-500"
                }`}
                placeholder="Masukkan nama warrior Anda"
                maxLength={20}
                autoFocus
              />
            </div>

            <div>
              <label className={`block ${styles.textColor} font-medium mb-2`}>
                ID Room
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                className={`w-full px-4 py-3 rounded-xl ${
                  styles.inputBg
                } border focus:outline-none focus:border-purple-400 uppercase tracking-wider text-center text-lg font-mono ${
                  currentTheme === "dark"
                    ? "placeholder-gray-400"
                    : "placeholder-gray-500"
                }`}
                placeholder="ROOM-XXXXXX"
                maxLength={11}
              />
              <p
                className={`${
                  currentTheme === "dark" ? "text-white/50" : "text-gray-500"
                } text-sm mt-2`}
              >
                Tanyakan ID Room ke host
              </p>
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={isJoining}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isJoining ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Bergabung...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🚀 Gabung Pertempuran
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
                className={`${
                  currentTheme === "dark" ? "text-white/70" : "text-gray-600"
                } mb-3`}
              >
                Tidak punya ID Room?
              </p>
              <button
                onClick={() => navigate("/game/create")}
                className={`${
                  currentTheme === "dark"
                    ? "text-purple-300 hover:text-purple-100"
                    : "text-purple-600 hover:text-purple-800"
                } font-semibold transition-colors`}
              >
                Buat Room Baru →
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
              💡 <strong>Tips:</strong> Pastikan Anda memiliki ID Room yang
              benar dari host!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
