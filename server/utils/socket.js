// src/utils/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
if (!socket) {
socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports: ["websocket"],
    secure: true,
});

socket.on("connect", () => {
    console.log("✅ Conectado al servidor de chat:", socket.id);
});

socket.on("disconnect", () => {
    console.log("❌ Desconectado del servidor de chat");
});
}
return socket;
};
