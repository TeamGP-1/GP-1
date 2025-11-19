import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import socket from "../socket/socket";
import { ThemeContext } from "../context/ThemeContext";

export default function Home({ user, onLogout }) {
  const navigate = useNavigate();
  const { currentTheme, setCurrentTheme, theme } = useContext(ThemeContext);
  const styles = theme[currentTheme];
  const [displayText, setDisplayText] = useState("");
  const [username, setUsername] = useState("");
  const fullText = "Type Warrior";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (localStorage.access_token) {
      socket.emit("verifyToken", localStorage.access_token);

      socket.on("tokenVerified", (data) => {
        if (data.success) {
          setUsername(data.user.username.toUpperCase());
        }
      });
    }

    return () => {
      socket.off("tokenVerified");
    };
  }, []);

  return (
    <div
      className={`pt-24 min-h-screen ${styles.bgColor} ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
      } flex items-center justify-center p-4`}
    >
      <div
        className={`${styles.cardBg} ${
          currentTheme === "dark" ? "border-gray-700/50" : "border-gray-300/50"
        } backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl shadow-2xl border`}
      >
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${styles.textColor}`}>🏠 Home</h1>
        </div>

        <div
          className={`${
            currentTheme === "dark"
              ? "bg-gray-700/50 border-gray-600/50"
              : "bg-gray-100/80 border-gray-300/50"
          } rounded-2xl p-6 mb-6 border`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👤</span>
            <h2 className={`text-xl font-semibold ${styles.textColor}`}>
              Halo, {username || "Memuat..."}
            </h2>
          </div>
        </div>

        <div
          className={`${
            currentTheme === "dark"
              ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50"
              : "bg-gradient-to-r from-blue-200/50 to-purple-200/50 border-blue-300/50"
          } rounded-2xl p-8 min-h-[200px] flex items-center justify-center border`}
        >
          <p
            className={`text-2xl ${styles.textColor} font-medium text-center leading-relaxed`}
          >
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        <div className="mt-8 flex flex-cols justify-center gap-8">
          <button
            onClick={() => navigate("/game")}
            className={`${
              currentTheme === "dark"
                ? "bg-gray-700/50 hover:bg-gray-600/50 border-gray-600/50"
                : "bg-gray-200/80 hover:bg-gray-300/80 border-gray-300/50"
            } rounded-xl p-4 transition-all cursor-pointer border w-1/3`}
          >
            <div
              className={`w-12 h-12 ${
                currentTheme === "dark" ? "bg-gray-600" : "bg-gray-300"
              } rounded-full mb-3 mx-auto flex items-center justify-center text-2xl`}
            >
              ⚔️
            </div>
            <p
              className={`${styles.textColor} text-center text-sm font-medium`}
            >
              Main Game
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
