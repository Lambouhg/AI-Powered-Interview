"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SidebarCompany";
import MessageList from "../../components/MessageList";
import MessageDetail from "../../components/MessageDetail";

import { useUser } from "@clerk/nextjs";
import HeaderCompany from "../../components/HeaderCompany";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../config/firebase"; // Import from the correct config location

const MessageCenter = () => {
  const { user, isLoaded } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMessageDetailView, setIsMobileMessageDetailView] = useState(false);

  // Hook để lấy conversationsSnapshot từ MessageList logic
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const queryGetConversationsForCurrentUser = userEmail
    ? query(collection(db, "conversations"), where("users", "array-contains", userEmail))
    : null;
  const [conversationsSnapshot, loadingConversations] = useCollection(queryGetConversationsForCurrentUser);

  // Khi conversations load xong và chưa chọn, tự động chọn cuộc trò chuyện mới nhất
  useEffect(() => {
    if (!loadingConversations && conversationsSnapshot && !selectedConversation) {
      let latest = null;
      let latestTime = 0;
      conversationsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const time = data.lastMessageTime ? data.lastMessageTime.toDate().getTime() : 0;
        if (time > latestTime) {
          latest = { id: doc.id, ...data };
          latestTime = time;
        }
      });
      if (latest) {
        setSelectedConversation(latest);
        if (window.innerWidth < 768) setIsMobileMessageDetailView(true);
      }
    }
  }, [loadingConversations, conversationsSnapshot, selectedConversation]);

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
            onBackClick={isMobileMessageDetailView ? handleBackToMessageList : undefined}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Message List */}
          <div
            className={`${isMobileMessageDetailView ? "hidden md:flex" : "flex"} flex-1 w-full md:w-1/3 border-r border-gray-300 overflow-y-auto`}
          >
            <MessageList
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
              user={user}
            />
          </div>

          {/* Message Detail */}
          <div
            className={`${isMobileMessageDetailView ? "w-full" : "hidden md:flex md:w-2/3"} overflow-y-auto`}
          >
            {selectedConversation ? (
              <MessageDetail conversation={selectedConversation} user={user} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
