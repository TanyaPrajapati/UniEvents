import { useState } from "react";


function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { type: "user", text: message }];
    setChat(newChat);

    const res = await fetch("http://localhost:3000/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setChat([
      ...newChat,
      { type: "bot", text: data.reply }
    ]);

    setMessage("");
  };

  return (
    <>
      
    <div className="chat-toggle" onClick={() => setOpen(!open)}></div>

      
      {open && (
        <div className="chat-container">
          <div className="chat-header">
            UniEvents AI
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.type === "user" ? "user-msg" : "bot-msg"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;