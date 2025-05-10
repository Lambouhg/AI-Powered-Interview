import React from "react";
import { Star, Pin, EllipsisVertical } from "lucide-react";
const MessageHeader = ({ recipientEmail }) => {
  if (!recipientEmail) {
    return null;
  }

  // Extracting name from email (before the @ symbol)
  const recipientName = recipientEmail.split("@")[0];
  return (
    <div className="flex flex-wrap gap-10 justify-between items-center px-8 pt-8 pb-6 w-full bg-white shadow-sm max-md:px-5 max-md:max-w-full">
      <div className="flex gap-4 justify-center items-center self-stretch my-auto min-w-[100px]">
        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {recipientName.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <h2 className="font-medium">{recipientName}</h2>
          <p className="text-sm text-gray-500">{recipientEmail}</p>
        </div>
      </div>
      <div className="flex gap-6 items-start self-stretch my-auto">
        <Pin size={22} className="text-blue-400" alt="Pin icon" />
        <Star size={22} className="text-yellow-400" alt="Star icon" />
        <EllipsisVertical
          size={22}
          className="text-slate-400"
          alt="Ellipsis icon"
        />
      </div>
    </div>
  );
};

export default MessageHeader;
