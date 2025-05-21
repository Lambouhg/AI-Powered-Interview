import React from "react";
import { Star, Pin, EllipsisVertical } from "lucide-react";
const MessageHeader = ({ recipientEmail }) => {
  if (!recipientEmail) {
    return null;
  }

  // Extracting name from email (before the @ symbol)
  const recipientName = recipientEmail.split("@")[0];
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white rounded-t-2xl shadow border-b">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {recipientName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold text-lg text-gray-900">{recipientName}</h2>
          <p className="text-xs text-green-500 font-medium">● Online</p>
          <p className="text-xs text-gray-500">{recipientEmail}</p>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <button className="hover:bg-gray-100 p-2 rounded-full"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.08a2 2 0 0 1 1.09-1.79l7-3.11a2 2 0 0 1 1.82 0l7 3.11A2 2 0 0 1 22 16.92z"/><circle cx="12" cy="7" r="4"/></svg></button>
        <button className="hover:bg-gray-100 p-2 rounded-full"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 10.5V6a5 5 0 0 0-10 0v4.5"/><rect width="20" height="12" x="2" y="10.5" rx="2"/><path d="M6 16v2m12-2v2"/></svg></button>
        <button className="hover:bg-gray-100 p-2 rounded-full"><EllipsisVertical size={22} className="text-slate-400" alt="Ellipsis icon" /></button>
      </div>
    </div>
  );
};

export default MessageHeader;
