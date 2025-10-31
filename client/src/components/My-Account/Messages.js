// src/components/My-Account/Messages.js
import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import ChatList from "../ChatList";

function Messages() {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Por favor, inicia sesión para ver tus mensajes.</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <ChatList arrendador_id={user.id} />
    </div>
  );
}

export default Messages;
