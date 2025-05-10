import React from "react";
import { Send } from "lucide-react";

const MessageInput = ({ input = "", setInput, sendMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <form
      onSubmit={sendMessage}
      className="flex items-center bg-gray-100 rounded-lg p-2 w-full"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 bg-transparent outline-none p-2 text-sm"
      />
      <button
        type="submit"
        disabled={!input || !input.trim()}
        className="ml-2 p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
