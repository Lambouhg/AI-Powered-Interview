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
      className={`flex p-4 gap-4 border-b border-gray-200 cursor-pointer ${
        active ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm md:text-base">{displayName}</h3>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-xs md:text-sm text-gray-600 truncate">{preview}</p>
      </div>
    </div>
  );
};
export default MessageListItem;
