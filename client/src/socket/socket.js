import { io } from "socket.io-client";

const SOCKET_URL = "https://type.nathanael.web.id";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
