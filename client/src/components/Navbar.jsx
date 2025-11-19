import { useNavigate } from "react-router";
import { showSuccess } from "./toastUI";
import { ThemeContext } from "../context/ThemeContext";
import { useState, useEffect, useContext } from "react";
import socket from "../socket/socket";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentTheme, setCurrentTheme, theme } = useContext(ThemeContext);
  const styles = theme[currentTheme];
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Try to get username from localStorage first
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Then verify with socket
    const token = localStorage.getItem("access_token");
    if (token) {
      // Connect socket if not connected
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("verifyToken", { token });

      socket.on("tokenVerified", (data) => {
        if (data.success) {
          setUsername(data.user.username.toUpperCase());
          localStorage.setItem("username", data.user.username.toUpperCase());
        }
      });
    }

    return () => {
      socket.off("tokenVerified");
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    showSuccess("Logout berhasil!");
    navigate("/login");
  }

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full ${styles.navbarBg} shadow-lg border-b backdrop-blur-sm bg-opacity-90 px-6 py-4 z-50`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold ${styles.textColor}`}>
              ⚔️ Typing Warrior
            </h1>
            {username && (
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  currentTheme === "dark"
                    ? "bg-blue-900/50 text-blue-200"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                👤 {username}
              </span>
            )}
          </div>
          <ul className="flex items-center space-x-4">
            <li>
              <button
                onClick={() => navigate("/")}
                className={`${
                  currentTheme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-blue-600"
                } font-medium transition-colors px-4 py-2 rounded-lg hover:bg-opacity-10 ${
                  currentTheme === "dark"
                    ? "hover:bg-white"
                    : "hover:bg-gray-200"
                }`}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className={`${
                  currentTheme === "dark"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gray-800 hover:bg-gray-900"
                } text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2`}
              >
                {currentTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-all"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
