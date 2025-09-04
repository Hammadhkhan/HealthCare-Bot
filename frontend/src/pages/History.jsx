import React, { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Chat History
          </h2>
          <button
            onClick={clearHistory}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Clear
          </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              No chat history saved.
            </p>
          ) : (
            history.map((chat, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg dark:border-slate-700"
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {chat.date}
                </p>
                <div className="mt-2 space-y-1">
                  {chat.messages.map((m, i) => (
                    <p
                      key={i}
                      className={`text-sm ${
                        m.sender === "user"
                          ? "text-cyan-600"
                          : "text-slate-800 dark:text-white"
                      }`}
                    >
                      <strong>{m.sender}:</strong> {m.text}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
