// src/components/ChatList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatComponent from "./ChatComponent";
import "../styles/ChatList.css";

export default function ChatList({ arrendador_id }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [conversacionActiva, setConversacionActiva] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar lista de conversaciones del arrendador
  useEffect(() => {
    if (!arrendador_id) return;
    
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/chat/conversaciones/${arrendador_id}`)
      .then((res) => {
        // Dedupe defensively by usuario_id in case backend returns duplicates
        const uniqueByUser = [];
        const seen = new Set();
        for (const conv of res.data || []) {
          if (!seen.has(conv.usuario_id)) {
            seen.add(conv.usuario_id);
            uniqueByUser.push(conv);
          }
        }
        setConversaciones(uniqueByUser);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar conversaciones:", err);
        setLoading(false);
      });
  }, [arrendador_id]);

  const abrirChat = (usuario) => {
    setConversacionActiva(usuario);
  };

  const cerrarChat = () => {
    setConversacionActiva(null);
  };

  if (loading) {
    return (
      <div className="chat-list-container">
        <div className="loading-spinner">Cargando conversaciones...</div>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      {!conversacionActiva ? (
        <div className="conversaciones-lista">
          <div className="chat-list-header">
            <h2>💬 Mis Conversaciones</h2>
            <p className="subtitle">Mensajes de usuarios interesados en tus propiedades</p>
          </div>

          {conversaciones.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No tienes conversaciones</h3>
              <p>Cuando los usuarios te contacten, aparecerán aquí</p>
            </div>
          ) : (
            <div className="conversaciones-grid">
              {conversaciones.map((conv) => (
                <div
                  key={conv.usuario_id}
                  className="conversacion-card"
                  onClick={() => abrirChat(conv)}
                >
                  <div className="conversacion-avatar">
                    <div className="avatar-circle">
                      {conv.usuario_nombre?.charAt(0).toUpperCase()}
                    </div>
                    {conv.mensajes_no_leidos > 0 && (
                      <span className="badge-unread">{conv.mensajes_no_leidos}</span>
                    )}
                  </div>

                  <div className="conversacion-info">
                    <div className="conversacion-header">
                      <h3 className="usuario-nombre">
                        {conv.usuario_nombre} {conv.usuario_apellido}
                      </h3>
                      <span className="timestamp">
                        {new Date(conv.ultimo_mensaje_fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <p className="ultimo-mensaje">
                      {conv.ultimo_mensaje?.substring(0, 50)}
                      {conv.ultimo_mensaje?.length > 50 ? '...' : ''}
                    </p>
                    {conv.apartamento_direccion && (
                      <span className="propiedad-tag">
                        🏠 {conv.apartamento_direccion}
                      </span>
                    )}
                  </div>

                  <div className="conversacion-action">
                    <button className="btn-abrir-chat">
                      Abrir chat →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="chat-activo-container">
          <div className="chat-header">
            <button className="btn-volver" onClick={cerrarChat}>
              ← Volver a conversaciones
            </button>
            <div className="chat-user-info">
              <div className="avatar-small">
                {conversacionActiva.usuario_nombre?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>
                  {conversacionActiva.usuario_nombre} {conversacionActiva.usuario_apellido}
                </h3>
                {conversacionActiva.apartamento_direccion && (
                  <p className="chat-propiedad">
                    Interesado en: {conversacionActiva.apartamento_direccion}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="chat-wrapper">
            <ChatComponent
              emisor_id={arrendador_id}
              receptor_id={conversacionActiva.usuario_id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
