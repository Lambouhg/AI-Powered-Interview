import React from "react";

const MessageContent = ({ messages, userEmail, endOfMessagesRef }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="text-gray-500">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 overflow-y-auto py-4 space-y-4">
      {messages.map((message) => {
        const isUser = message.sender === userEmail;

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                isUser
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p>{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  isUser ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Sending..."}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageContent;
