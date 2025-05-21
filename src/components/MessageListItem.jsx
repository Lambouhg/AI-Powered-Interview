import React from "react";

const MessageListItem = ({ id, name, time, preview, active, onClick }) => {
  // Safely get the first letter, handling different input types
  const firstLetter =
    typeof name === "string" ? name.charAt(0).toUpperCase() : "?";

  // Convert name to a string, with a fallback
  const displayName =
    typeof name === "string"
      ? name
      : name?.email || name?.toString() || "Unknown";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${active ? "bg-white shadow rounded-xl" : "hover:bg-white hover:shadow rounded-xl"}`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-lg text-blue-700">
        {firstLetter}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900 truncate text-base">{displayName}</span>
          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{time}</span>
        </div>
        <span className="text-xs text-gray-500 truncate block">{preview}</span>
      </div>
    </div>
  );
};
export default MessageListItem;
