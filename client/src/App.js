import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("https://realtime-chat-7ad7.onrender.com");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (!message || !name) return;

    socket.emit("send_message", {
      name,
      message,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
  };

  return (
    <div className="app">
      <div className="chat-box">
        <h1>Realtime Chat</h1>

        <input
          className="name-input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="messages">
          {chat.map((msg, index) => (
            <div className="message" key={index}>
              <strong>{msg.name}</strong>
              <p>{msg.message}</p>
              <span>{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="send-box">
          <input
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;