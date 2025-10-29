// src/utils/socket.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    const serverUrl = process.env.REACT_APP_API_URL || "https://localhost:3443";
    socket = io(serverUrl, {
      transports: ["websocket"],
      secure: true,
      rejectUnauthorized: false, // si usas certificado autofirmado local
    });

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
      if (userId) socket.emit("register", userId);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket desconectado");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
    });
  } else {
    // si ya existe socket, todavía (re)emitimos registro si userId cambió
    if (userId) socket.emit("register", userId);
  }
  return socket;
};

export const getSocket = () => socket;
