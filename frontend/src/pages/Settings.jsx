import React, { useEffect, useState } from "react";

export default function Settings() {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [model, setModel] = useState("distilbert");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleModelChange = (e) => {
    setModel(e.target.value);
    localStorage.setItem("aiModel", e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          Settings
        </h2>
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">
              Dark Mode
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dark}
                onChange={() => setDark(!dark)}
                className="sr-only"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                    dark ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">
              AI Model
            </label>
            <select
              value={model}
              onChange={handleModelChange}
              className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
            >
              <option value="distilbert">DistilBERT</option>
              <option value="bart">BART</option>
              <option value="biobert">BioBERT</option>
            </select>
          </div>

          {/* Clear Chat History */}
          <button
            onClick={() => {
              localStorage.removeItem("chatHistory");
              alert("Chat history cleared!");
            }}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Clear Chat History
          </button>
        </div>
      </div>
    </div>
  );
}
