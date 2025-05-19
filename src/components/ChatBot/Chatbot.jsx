import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatbot.css";

const BOT_START_MESSAGE =
  "Hi! I'm your AI assistant. How can I help you today?";

function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: BOT_START_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  // Call OpenRouter API
  const getBotResponse = async (userMessage) => {
    const deepkey = import.meta.env.VITE_DEEPSEEK_KEY;
    const deepurl = import.meta.env.VITE_DEEPSEEK_URL;
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: deepurl,
          messages: [{ role: "user", content: userMessage }],
        },
        {
          headers: {
            Authorization: `Bearer ${deepkey}`,
            "HTTP-Referer": "zegy.com",
            "X-Title": "zegyai", // Optional
            "Content-Type": "application/json",
          },
        }
      );
      return (
        response.data.choices?.[0]?.message?.content ||
        "Sorry, I didn't get that."
      );
    } catch (error) {
      return "Sorry, there was a problem connecting to the AI service.", error;
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    const botReply = await getBotResponse(trimmed);
    setMessages((msgs) => [...msgs, { sender: "bot", text: botReply }]);
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!open && (
        <button
          className="chatbot-fab chatbot-fab-glass"
          aria-label="Open Chatbot"
          onClick={() => setOpen(true)}
        >
          <span className="chatbot-fab-icon" />
        </button>
      )}
      {open && (
        <div className="chatbotWindow chatbot-glass">
          <div className="header chatbot-glass-header">
            <span className="title">AI ChatBot</span>
            <button
              className="closeBtn"
              aria-label="Minimize"
              onClick={() => setOpen(false)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22">
                <rect
                  x="5"
                  y="10"
                  width="12"
                  height="2"
                  rx="1"
                  fill="#6c757d"
                />
              </svg>
            </button>
          </div>
          <div className="messagesArea">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.sender === "user"
                    ? "bubbleUser chatbot-glass-user"
                    : "bubbleBot chatbot-glass-bot"
                }
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bubbleBot chatbot-glass-bot">
                <LoadingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            className="inputArea chatbot-glass-input"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            autoComplete="off"
          >
            <input
              type="text"
              className="input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              aria-label="Type your message"
            />
            <button
              type="submit"
              className="sendBtn"
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 20 20"
                style={{ transform: "rotate(-10deg)" }}
              >
                <path
                  d="M3 17l13.5-6.5c.7-.3.7-1.2 0-1.5L3 2"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const LoadingIndicator = () => (
  <span className="loadingDots">
    <span className="dot" style={{ animationDelay: "0s" }} />
    <span className="dot" style={{ animationDelay: "0.2s" }} />
    <span className="dot" style={{ animationDelay: "0.4s" }} />
  </span>
);

export default ChatBot;
