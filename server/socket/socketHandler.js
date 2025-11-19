const { GoogleGenerativeAI } = require("@google/generative-ai");
const { verifyToken } = require("../helpers/jwt");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_CLIENT);

const rooms = new Map();

async function generateTypingText() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt =
      "Buatkan satu kalimat acak dalam Bahasa Indonesia (20 - 30 kata) untuk latihan mengetik. Hanya kembalikan kalimatnya saja, tidak ada yang lain. Jangan gunakan tanda kutip.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.trim().replace(/['"]/g, "");

    return text;
  } catch (error) {
    return "Seekor rubah coklat yang cepat melompati anjing malas di tengah hutan yang rimbun pada pagi hari";
  }
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("verifyToken", (token) => {
      try {
        const payload = verifyToken(token);
        socket.emit("tokenVerified", {
          success: true,
          user: {
            username: payload.username,
            email: payload.email,
          },
        });
      } catch (error) {
        socket.emit("tokenVerified", {
          success: false,
          message: "Invalid token",
        });
      }
    });

    // Create Room
    socket.on("createRoom", async ({ playerName, roomId }) => {
      if (rooms.has(roomId)) {
        socket.emit("error", { message: "Room sudah ada!" });
        return;
      }

      const typingText = await generateTypingText();

      rooms.set(roomId, {
        id: roomId,
        players: [
          {
            id: socket.id,
            name: playerName,
            progress: 0,
            finished: false,
          },
        ],
        typingText: typingText,
        gameStarted: false,
        winner: null,
      });

      socket.join(roomId);
      socket.emit("roomCreated", {
        roomId,
        typingText,
        players: rooms.get(roomId).players,
      });
    });

    socket.on("joinRoom", ({ playerName, roomId }) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room tidak ditemukan!" });
        return;
      }

      if (room.gameStarted) {
        socket.emit("error", { message: "Game sudah dimulai!" });
        return;
      }

      if (room.players.length >= 5) {
        socket.emit("error", { message: "Room penuh! (Max 5 players)" });
        return;
      }

      room.players.push({
        id: socket.id,
        name: playerName,
        progress: 0,
        finished: false,
      });

      socket.join(roomId);

      io.to(roomId).emit("playerJoined", {
        players: room.players,
        typingText: room.typingText,
      });
    });

    socket.on("getRoomState", ({ roomId }) => {
      const room = rooms.get(roomId);

      if (room) {
        socket.emit("playerJoined", {
          players: room.players,
          typingText: room.typingText,
        });
      }
    });

    socket.on("startGame", ({ roomId }) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room tidak ditemukan!" });
        return;
      }

      room.gameStarted = true;
      io.to(roomId).emit("gameStarted", {
        typingText: room.typingText,
        players: room.players,
      });
    });

    // Update Progress
    socket.on("updateProgress", ({ roomId, progress, input }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;

      // Validasi input dengan text yang di-generate
      const words = room.typingText.trim().split(/\s+/);
      const inputWords = input.trim().split(/\s+/);

      // Cek apakah input sesuai dengan text
      let isValid = true;
      for (let i = 0; i < inputWords.length; i++) {
        if (inputWords[i] !== words[i]) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        return;
      }

      player.progress = progress;

      if (progress >= 100 && !player.finished && !room.winner) {
        player.finished = true;
        room.winner = {
          id: player.id,
          name: player.name,
        };

        io.to(roomId).emit("gameFinished", {
          winner: room.winner,
          players: room.players,
        });
      } else {
        io.to(roomId).emit("progressUpdated", {
          players: room.players,
        });
      }
    });

    // Restart Game
    socket.on("restartGame", async ({ roomId }) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room tidak ditemukan!" });
        return;
      }

      // Generate new typing text
      const newTypingText = await generateTypingText();

      // Reset room state
      room.typingText = newTypingText;
      room.gameStarted = false;
      room.winner = null;

      // Reset all players
      room.players.forEach((player) => {
        player.progress = 0;
        player.finished = false;
      });

      // Emit to all players in room
      io.to(roomId).emit("gameRestarted", {
        typingText: newTypingText,
        players: room.players,
      });
    });

    socket.on("leaveRoom", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      room.players = room.players.filter((p) => p.id !== socket.id);
      socket.leave(roomId);

      if (room.players.length === 0) {
        rooms.delete(roomId);
      } else {
        io.to(roomId).emit("playerLeft", {
          players: room.players,
        });
      }
    });

    socket.on("disconnect", () => {
      rooms.forEach((room, roomId) => {
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);

          if (room.players.length === 0) {
            rooms.delete(roomId);
          } else {
            io.to(roomId).emit("playerLeft", {
              players: room.players,
            });
          }
        }
      });
    });
  });
};
