// src/components/ChatComponent.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { initSocket, getSocket } from "../utils/socket";
import "../styles/ChatComponent.css";

export default function ChatComponent({ emisor_id, receptor_id }) {
  const [mensajes, setMensajes] = useState([]);
  const [contenido, setContenido] = useState("");
  const chatRef = useRef(null);

  // Inicializa socket con el emisor_id (register)
  useEffect(() => {
    if (!emisor_id) return;
    initSocket(emisor_id);
  }, [emisor_id]);

  // referenciar socket
  const socket = getSocket();

  // Cargar mensajes de la conversación
  useEffect(() => {
    if (!emisor_id || !receptor_id) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/chat/${emisor_id}/${receptor_id}`)
      .then((res) => setMensajes(res.data))
      .catch((err) => console.error("Error al cargar mensajes:", err));
  }, [emisor_id, receptor_id]);

  // Escuchar mensajes nuevos del servidor
  useEffect(() => {
  if (!socket) return;

  const handleNuevoMensaje = (data) => {
    if (
      (String(data.emisor_id) === String(emisor_id) && String(data.receptor_id) === String(receptor_id)) ||
      (String(data.emisor_id) === String(receptor_id) && String(data.receptor_id) === String(emisor_id))
    ) {
      setMensajes((prev) => {
        // Evitar duplicado si ya existe ese id
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    }
  };

  socket.on("nuevo_mensaje", handleNuevoMensaje);
  return () => {
    socket.off("nuevo_mensaje", handleNuevoMensaje);
  };
  }, [socket, emisor_id, receptor_id]);


  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Enviar mensaje
  const enviarMensaje = () => {
  if (!socket) {
    alert("No hay conexión al servidor de chat.");
    return;
  }
  if (!contenido.trim()) return;

  const provisionalId = Date.now(); // id temporal único
  const data = { id: provisionalId, emisor_id, receptor_id, contenido, provisional: true };
  setMensajes((prev) => [...prev, data]); // mostrar provisional
  setContenido("");

  socket.emit("enviar_mensaje", { emisor_id, receptor_id, contenido });

  socket.once("mensaje_guardado", (res) => {
    if (res.success) {
      setMensajes((prev) =>
        prev.map((msg) =>
          msg.id === provisionalId
            ? { ...msg, id: res.id, provisional: false }
            : msg
        )
      );
    } else {
      console.error("Error guardando mensaje:", res.error);
      // opcional: eliminar provisional si falla
      setMensajes((prev) => prev.filter((m) => m.id !== provisionalId));
    }
  });
  };


  return (
    <div className="chat-container">
      <div className="chat-mensajes" ref={chatRef}>
        {mensajes.map((msg, i) => (
          <div
            key={msg.id || i}
            className={`mensaje ${String(msg.emisor_id) === String(emisor_id) ? "enviado" : "recibido"} ${msg.provisional ? "provisional" : ""}`}
          >
            <p>{msg.contenido}</p>
            <small className="timestamp">
              {msg.fecha_envio ? new Date(msg.fecha_envio).toLocaleString() : (msg.provisional ? "Enviando..." : "")}
            </small>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
}
