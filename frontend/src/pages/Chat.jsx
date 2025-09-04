import React, { useState, useRef } from "react";
import api from "../api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input && files.length === 0) return;

    const newMsg = { sender: "user", text: input, files: files.map(f => f.name) };
    setMessages((prev) => [...prev, newMsg]);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", input);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await api.post("/chat/message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error fetching reply." },
      ]);
    } finally {
      setInput("");
      setFiles([]);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-md px-4 py-2 rounded-2xl shadow ${
                msg.sender === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-white dark:bg-slate-700 dark:text-white"
              }`}>
              <p>{msg.text}</p>
              {msg.files &&
                msg.files.map((f, i) => (
                  <p key={i} className="text-xs text-slate-400">
                    📎 {f}
                  </p>
                ))}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-center text-slate-500 dark:text-slate-400">
            ⏳ AI is thinking...
          </p>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="p-4 bg-white dark:bg-slate-900 shadow flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg border dark:bg-slate-800 dark:text-white"
        />
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
        >
          📎
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
