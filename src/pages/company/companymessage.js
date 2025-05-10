"use client";
import React, { useState } from "react";
import Sidebar from "../../components/SidebarCompany";
import MessageList from "../../components/MessageList";
import MessageDetail from "../../components/MessageDetail";

import { useUser } from "@clerk/nextjs";
import HeaderCompany from "../../components/HeaderCompany";

const MessageCenter = () => {
  const { user, isLoaded } = useUser(); // Kiểm tra trạng thái tải dữ liệu
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMessageDetailView, setIsMobileMessageDetailView] =
    useState(false);
  // Nếu dữ liệu user chưa tải xong, hiển thị loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // On mobile, switch to message detail view
    if (window.innerWidth < 768) {
      setIsMobileMessageDetailView(true);
    }
  };

  const handleBackToMessageList = () => {
    setIsMobileMessageDetailView(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header */}
        <div className="w-full px-4 py-3 border-b-2 border-gray-200">
          <HeaderCompany
            dashboardHeaderName={"Messages"}
            onBackClick={
              isMobileMessageDetailView ? handleBackToMessageList : undefined
            }
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Message List */}
          <div
            className={`${
              isMobileMessageDetailView ? "hidden md:flex" : "flex"
            } flex-1 w-full md:w-1/3 border-r border-gray-300 overflow-y-auto`}
          >
            <MessageList
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
              user={user}
            />
          </div>

          {/* Message Detail */}
          <div
            className={`${
              isMobileMessageDetailView ? "w-full" : "hidden md:flex md:w-2/3"
            } overflow-y-auto`}
          >
            {selectedConversation ? (
              <MessageDetail conversation={selectedConversation} user={user} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
