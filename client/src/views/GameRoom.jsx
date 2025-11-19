import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import socket from "../socket/socket";
import { showError, showSuccess } from "../components/toastUI";
import { ThemeContext } from "../context/ThemeContext";

export default function GameRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { playerName, isHost } = location.state || {};
  const { currentTheme, theme } = useContext(ThemeContext);
  const styles = theme[currentTheme];

  const [players, setPlayers] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [inputStatus, setInputStatus] = useState({ type: "", message: "" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!playerName) {
      navigate("/game");
      return;
    }

    // Request current room state
    socket.emit("getRoomState", { roomId });

    socket.on("playerJoined", (data) => {
      setPlayers(data.players);
      setTypingText(data.typingText);

      if (!isInitialLoad) {
        showSuccess("Player baru bergabung!");
      }
      setIsInitialLoad(false);
    });

    socket.on("playerLeft", (data) => {
      setPlayers(data.players);
      showError("Player keluar!");
    });

    socket.on("gameStarted", (data) => {
      setGameStarted(true);
      setTypingText(data.typingText);
      setPlayers(data.players);
      showSuccess("Game dimulai!");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    });

    socket.on("progressUpdated", (data) => {
      setPlayers(data.players);
    });

    socket.on("gameFinished", (data) => {
      setWinner(data.winner);
      setPlayers(data.players);
      showSuccess(`${data.winner.name} menang!`);
    });

    socket.on("gameRestarted", (data) => {
      setTypingText(data.typingText);
      setPlayers(data.players);
      setGameStarted(false);
      setWinner(null);
      setUserInput("");
      setCurrentProgress(0);
      setInputStatus({ type: "", message: "" });
      showSuccess("Game di-restart! Siap bermain lagi!");
    });

    socket.on("error", (data) => {
      showError(data.message);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("gameStarted");
      socket.off("progressUpdated");
      socket.off("gameFinished");
      socket.off("gameRestarted");
      socket.off("error");
    };
  }, [playerName, navigate, roomId]);

  const handleStartGame = () => {
    socket.emit("startGame", { roomId });
  };

  const handleRestartGame = () => {
    socket.emit("restartGame", { roomId });
  };

  const handleInputChange = (e) => {
    if (!gameStarted || winner) return;

    const input = e.target.value;
    setUserInput(input);

    // Validasi input dengan text yang di-generate
    const words = typingText.trim().split(/\s+/);
    const inputWords = input.trim().split(/\s+/);

    // Cek apakah input sesuai dengan text
    let isValid = true;
    let errorIndex = -1;
    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] !== words[i]) {
        isValid = false;
        errorIndex = i;
        break;
      }
    }

    // Update status berdasarkan validasi
    if (!input.trim()) {
      setInputStatus({ type: "", message: "" });
    } else if (!isValid) {
      setInputStatus({
        type: "error",
        message: `❌ Kata ke-${errorIndex + 1} salah! Seharusnya: "${
          words[errorIndex]
        }"`,
      });
    } else if (
      inputWords.length === words.length &&
      input.trim() === typingText.trim()
    ) {
      setInputStatus({
        type: "success",
        message: "✅ Perfect! Menunggu verifikasi...",
      });
    } else {
      setInputStatus({
        type: "success",
        message: `✅ Benar! Lanjutkan... (${inputWords.length}/${words.length} kata)`,
      });
    }

    // Hitung progress
    const progress = Math.min((inputWords.length / words.length) * 100, 100);
    setCurrentProgress(progress);

    // Emit progress ke server
    socket.emit("updateProgress", {
      roomId,
      progress,
      input: input.trim(),
    });
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", { roomId });
    socket.disconnect();
    navigate("/game");
  };

  // Prevent copy-paste on typing text
  const preventCopyPaste = (e) => {
    e.preventDefault();
    setInputStatus({
      type: "error",
      message: "⚠️ Copy-paste tidak diperbolehkan! Ketik manual.",
    });
    setTimeout(() => {
      if (!userInput.trim()) {
        setInputStatus({ type: "", message: "" });
      }
    }, 3000);
  };

  // Render highlighted text
  const renderHighlightedText = () => {
    const words = typingText.trim().split(/\s+/);
    const inputWords = userInput.trim().split(/\s+/);
    const currentInputWithoutSpace = userInput; // Input asli tanpa trim
    const hasTrailingSpace = currentInputWithoutSpace.endsWith(" ");

    return words.map((word, index) => {
      let className = "px-2 py-1 rounded ";

      // Jika kata sudah selesai diketik (ada spasi setelahnya atau sudah pindah ke kata berikutnya)
      if (
        index < inputWords.length - 1 ||
        (index === inputWords.length - 1 && hasTrailingSpace)
      ) {
        // Kata sudah selesai, cek benar atau salah
        if (inputWords[index] === word) {
          className += "bg-green-500 text-white"; // Benar
        } else {
          className += "bg-red-500 text-white"; // Salah
        }
      }
      // Kata yang sedang diketik (belum ada spasi)
      else if (index === inputWords.length - 1 && !hasTrailingSpace) {
        className += "bg-yellow-300 text-gray-900"; // Sedang diketik
      }
      // Kata yang belum diketik
      else {
        className +=
          currentTheme === "dark" ? "text-gray-300" : "text-gray-700";
      }

      return (
        <span key={index} className={className}>
          {word}{" "}
        </span>
      );
    });
  };

  return (
    <div
      className={`pt-24 min-h-screen ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      } p-4`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`${
            currentTheme === "dark"
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/80 border-gray-300/50"
          } backdrop-blur-lg rounded-2xl p-6 mb-6 border`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  currentTheme === "dark" ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Room: {roomId}
              </h1>
              <p
                className={
                  currentTheme === "dark" ? "text-blue-200" : "text-gray-700"
                }
              >
                Pemain: {playerName}
              </p>
            </div>
            <div className="flex gap-4">
              {isHost && !gameStarted && (
                <button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  🎮 Mulai Game
                </button>
              )}
              <button
                onClick={handleLeaveRoom}
                className="bg-red-500/80 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-all"
              >
                🚪 Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Players List */}
          <div
            className={`${
              currentTheme === "dark"
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/80 border-gray-300/50"
            } backdrop-blur-lg rounded-2xl p-6 border`}
          >
            <h2
              className={`text-2xl font-bold ${
                currentTheme === "dark" ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              👥 Pemain ({players.length})
            </h2>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`${
                    currentTheme === "dark"
                      ? "bg-gray-700/30"
                      : "bg-gray-100/50"
                  } rounded-xl p-4 border ${
                    player.finished
                      ? "border-green-400"
                      : currentTheme === "dark"
                      ? "border-gray-600/50"
                      : "border-gray-300/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`${
                        currentTheme === "dark" ? "text-white" : "text-gray-900"
                      } font-bold`}
                    >
                      {player.name}
                      {player.id === socket.id && " (Anda)"}
                    </span>
                    {player.finished && <span className="text-2xl">👑</span>}
                  </div>
                  <div
                    className={`w-full ${
                      currentTheme === "dark" ? "bg-gray-600" : "bg-gray-300"
                    } rounded-full h-3`}
                  >
                    <div
                      className={`h-3 rounded-full transition-all ${
                        player.finished ? "bg-green-400" : "bg-blue-400"
                      }`}
                      style={{ width: `${player.progress}%` }}
                    ></div>
                  </div>
                  <p
                    className={`${
                      currentTheme === "dark"
                        ? "text-white/70"
                        : "text-gray-600"
                    } text-sm mt-1`}
                  >
                    {Math.round(player.progress)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Game Area */}
          <div className="md:col-span-2">
            {!gameStarted ? (
              <div
                className={`${
                  currentTheme === "dark"
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white/80 border-gray-300/50"
                } backdrop-blur-lg rounded-2xl p-12 border text-center`}
              >
                <div className="text-6xl mb-4">⏳</div>
                <h2
                  className={`text-3xl font-bold ${
                    currentTheme === "dark" ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Menunggu game dimulai...
                </h2>
                {isHost ? (
                  <p
                    className={`${
                      currentTheme === "dark"
                        ? "text-blue-200"
                        : "text-gray-700"
                    } text-lg`}
                  >
                    Klik "Mulai Game" untuk memulai!
                  </p>
                ) : (
                  <p
                    className={`${
                      currentTheme === "dark"
                        ? "text-blue-200"
                        : "text-gray-700"
                    } text-lg`}
                  >
                    Menunggu host memulai game...
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Typing Text */}
                <div
                  className={`${
                    currentTheme === "dark"
                      ? "bg-gray-800/50 border-gray-700/50"
                      : "bg-white/80 border-gray-300/50"
                  } backdrop-blur-lg rounded-2xl p-8 border`}
                >
                  <h3
                    className={`text-xl font-bold ${
                      currentTheme === "dark" ? "text-white" : "text-gray-900"
                    } mb-4`}
                  >
                    📝 Ketik ini:
                  </h3>
                  <div
                    className={`${
                      currentTheme === "dark"
                        ? "bg-gray-700/50"
                        : "bg-gray-100/50"
                    } rounded-xl p-6 text-2xl leading-relaxed min-h-[120px] select-none`}
                    onCopy={preventCopyPaste}
                    onCut={preventCopyPaste}
                    onDragStart={preventCopyPaste}
                    style={{
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                    }}
                  >
                    {renderHighlightedText()}
                  </div>
                </div>

                {/* Input Area */}
                <div
                  className={`${
                    currentTheme === "dark"
                      ? "bg-gray-800/50 border-gray-700/50"
                      : "bg-white/80 border-gray-300/50"
                  } backdrop-blur-lg rounded-2xl p-8 border`}
                >
                  <h3
                    className={`text-xl font-bold ${
                      currentTheme === "dark" ? "text-white" : "text-gray-900"
                    } mb-4`}
                  >
                    ⌨️ Input Anda:
                  </h3>
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onPaste={preventCopyPaste}
                    disabled={!!winner}
                    className={`w-full px-6 py-4 rounded-xl ${
                      currentTheme === "dark"
                        ? "bg-gray-700/50 text-white placeholder-gray-400"
                        : "bg-gray-100 text-gray-900 placeholder-gray-500"
                    } border-2 text-xl focus:outline-none disabled:opacity-50 transition-colors ${
                      inputStatus.type === "error"
                        ? "border-red-500"
                        : inputStatus.type === "success"
                        ? "border-green-500"
                        : currentTheme === "dark"
                        ? "border-gray-600/50 focus:border-blue-400"
                        : "border-gray-300/50 focus:border-blue-400"
                    }`}
                    placeholder="Mulai mengetik di sini..."
                    autoFocus
                  />

                  {/* Input Status Message */}
                  {inputStatus.message && (
                    <div
                      className={`mt-3 p-3 rounded-lg text-sm font-medium ${
                        inputStatus.type === "error"
                          ? "bg-red-500/20 text-red-200 border border-red-500/50"
                          : "bg-green-500/20 text-green-200 border border-green-500/50"
                      }`}
                    >
                      {inputStatus.message}
                    </div>
                  )}

                  <div className="mt-4">
                    <div
                      className={`flex justify-between ${
                        currentTheme === "dark" ? "text-white" : "text-gray-900"
                      } mb-2`}
                    >
                      <span>Progress Anda</span>
                      <span className="font-bold">
                        {Math.round(currentProgress)}%
                      </span>
                    </div>
                    <div
                      className={`w-full ${
                        currentTheme === "dark" ? "bg-gray-600" : "bg-gray-300"
                      } rounded-full h-4`}
                    >
                      <div
                        className="h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all"
                        style={{ width: `${currentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Winner Announcement */}
                {winner && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                      {winner.name} MENANG!
                    </h2>
                    <p className="text-white/90 text-xl mb-6">
                      Selamat atas kemenanganmu!
                    </p>
                    {isHost && (
                      <button
                        onClick={handleRestartGame}
                        className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all text-lg shadow-lg"
                      >
                        🔄 Main Lagi
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
