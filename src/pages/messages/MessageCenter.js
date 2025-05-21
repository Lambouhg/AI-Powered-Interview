"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { Menu, X, ChevronLeft, Star, Pin, EllipsisVertical, Search, Send } from "lucide-react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, addDoc, orderBy, serverTimestamp, doc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Dialog, Button, TextField } from "@mui/material";
import * as EmailValidator from "email-validator";
import {
  FiMessageSquare,
  FiBriefcase,
  FiSearch,
  FiHome,
  FiSettings,
  FiLogOut,
  FiUser,
  FiGlobe,
} from "react-icons/fi";
import { Brain } from "lucide-react";
import Sidebar from "../../components/Sidebar";

// NavItem Component cho Sidebar
function NavItem({ icon, label, href, active }) {
  const router = useRouter();
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${active ? "bg-white text-blue-600 shadow font-semibold" : "hover:bg-white hover:shadow"}`}
      onClick={() => router.push(href)}
    >
      {icon}
      <span className="text-base">{label}</span>
    </div>
  );
}

// DashboardHeader Component
function DashboardHeader({ dashboardHeaderName, onBackClick }) {
  return (
    <div className="flex items-center">
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="md:hidden mr-4 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-800">
        {dashboardHeaderName}
      </h1>
    </div>
  );
}

// MessageListItem Component
function MessageListItem({ id, name, time, preview, active, onClick }) {
  // Safely get the first letter, handling different input types
  const firstLetter = typeof name === "string" ? name.charAt(0).toUpperCase() : "?";
  // Convert name to a string, with a fallback
  const displayName = typeof name === "string" ? name : name?.email || name?.toString() || "Unknown";
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
}

// MessageHeader Component
function MessageHeader({ recipientEmail }) {
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
}

// MessageContent Component
function MessageContent({ messages, userEmail, endOfMessagesRef }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 overflow-y-auto py-6 px-6 space-y-2 bg-white rounded-b-2xl shadow">
      {messages.map((message) => {
        const isUser = message.sender === userEmail;
        return (
          <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}> 
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow-sm mb-1 ${isUser ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-br-sm" : "bg-gray-200 text-gray-800 rounded-bl-sm"}`}>
              <p className="break-words whitespace-pre-line">{message.text}</p>
              <p className={`text-xs mt-1 ${isUser ? "text-purple-100" : "text-gray-500"}`}>{message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Sending..."}</p>
            </div>
          </div>
        );
      })}
      <div ref={endOfMessagesRef} />
    </div>
  );
}

// MessageInput Component
function MessageInput({ input = "", setInput, sendMessage }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };
  return (
    <form onSubmit={sendMessage} className="flex items-center gap-2 bg-[#f0f2f5] rounded-full px-4 py-2 m-4 shadow">
      <button type="button" className="p-2 text-gray-500 hover:text-blue-500"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg></button>
      <button type="button" className="p-2 text-gray-500 hover:text-blue-500"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M8 11h.01M16 11h.01"/></svg></button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Aa"
        className="flex-1 bg-transparent outline-none p-2 text-base"
      />
      <button
        type="submit"
        disabled={!input || !input.trim()}
        className="ml-2 p-2 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow"
      >
        <Send size={20} />
      </button>
    </form>
  );
}

// MessageList Component
function MessageList({ user, selectedConversationId, onSelectConversation }) {
  const userEmail = user.primaryEmailAddress?.emailAddress;
  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // Query conversations for current user
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", userEmail)
  );
  const [conversationsSnapshot, loading, error] = useCollection(queryGetConversationsForCurrentUser);
  const toggleNewConversationDialog = (isOpen) => {
    setIsOpenNewConversationDialog(isOpen);
    if (!isOpen) setRecipientEmail("");
  };
  const closeNewConversationDialog = () => {
    toggleNewConversationDialog(false);
  };
  const isConversationAlreadyExists = (recipientEmail) =>
    conversationsSnapshot?.docs.find((conversation) =>
      conversation.data().users.includes(recipientEmail)
    );
  const isInvitingSelf = recipientEmail === userEmail;
  const createConversation = async () => {
    if (!recipientEmail) return;
    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      // Add conversation to db "conversations" collection
      await addDoc(collection(db, "conversations"), {
        users: [userEmail, recipientEmail],
        createdAt: new Date(),
        lastMessage: null,
        lastMessageTime: null,
      });
    }
    closeNewConversationDialog();
  };
  // Filter conversations based on search input
  const filteredConversations = conversationsSnapshot?.docs.filter((conversation) => {
    const conversationData = conversation.data();
    const otherUser = conversationData.users.find((user) => user !== userEmail);
    return (
      !searchInput ||
      otherUser?.toLowerCase().includes(searchInput.toLowerCase())
    );
  });
  return (
    <div className="flex flex-col bg-[#f0f2f5] w-full h-full rounded-xl">
      {/* Search Bar */}
      <div className="flex gap-2 items-center px-4 py-3 w-full text-base leading-relaxed text-gray-400 bg-[#f0f2f5]">
        <Search size={22} className="self-stretch my-auto" />
        <input
          type="text"
          placeholder="Tìm kiếm trên Messenger"
          className="self-stretch my-auto p-2 outline-none w-full rounded-full bg-white text-gray-700 border border-gray-200 focus:ring-2 focus:ring-blue-200"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {/* New Conversation Button */}
      <button
        className="w-[90%] mx-auto py-2 bg-blue-500 text-white font-medium mt-2 mb-2 rounded-full hover:bg-blue-600 transition-colors text-sm"
        onClick={() => toggleNewConversationDialog(true)}
      >
        + Cuộc trò chuyện mới
      </button>
      {/* Conversation List */}
      <div className="flex flex-col mt-1 overflow-y-auto">
        {!loading &&
          filteredConversations?.map((conversation) => {
            const conversationData = conversation.data();
            const otherUser = conversationData.users.find((user) => user !== userEmail);
            return (
              <MessageListItem
                key={conversation.id}
                id={conversation.id}
                name={otherUser || "Unknown"}
                time={
                  conversationData.lastMessageTime
                    ? new Date(conversationData.lastMessageTime.toDate()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "New"
                }
                preview={conversationData.lastMessage || "Bắt đầu trò chuyện..."}
                active={selectedConversationId === conversation.id}
                onClick={() =>
                  onSelectConversation({
                    id: conversation.id,
                    ...conversationData,
                  })
                }
              />
            );
          })}
      </div>
      <Dialog open={isOpenNewConversationDialog} onClose={closeNewConversationDialog}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Cuộc trò chuyện mới</h2>
          <p className="mb-4 text-gray-600">
            Nhập email người bạn muốn trò chuyện
          </p>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={recipientEmail}
            onChange={(event) => setRecipientEmail(event.target.value)}
            className="mb-6"
          />
          <div className="flex justify-end gap-3">
            <Button onClick={closeNewConversationDialog} variant="outlined">
              Hủy
            </Button>
            <Button
              disabled={!recipientEmail}
              onClick={createConversation}
              variant="contained"
              color="primary"
            >
              Tạo
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

// MessageDetail Component
function MessageDetail({ conversation, user }) {
  const userEmail = user.primaryEmailAddress?.emailAddress;
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState(null);
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [loadingRecipient, setLoadingRecipient] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  // Lắng nghe thay đổi của conversation
  useEffect(() => {
    if (conversation) {
      setLoadingConversation(false);
    }
  }, [conversation]);
  // Lấy email người nhận từ conversation
  useEffect(() => {
    if (conversation?.users && Array.isArray(conversation.users)) {
      const recipient = conversation.users.find((email) => email !== userEmail);
      setRecipientEmail(recipient || null);
      setLoadingRecipient(false);
    } else {
      setLoadingRecipient(false);
      console.error(
        "Conversation users is not an array or is undefined:",
        conversation
      );
    }
  }, [conversation, userEmail]);
  // Lắng nghe thay đổi tin nhắn real-time
  useEffect(() => {
    if (!conversation?.id) return;
    setLoadingMessages(true);
    const messagesQuery = query(
      collection(db, "messages"),
      where("conversationId", "==", conversation.id),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((message) => ({
          id: message.id,
          ...message.data(),
          timestamp: message.data().timestamp?.toDate().getTime() || Date.now(),
        }))
      );
      setLoadingMessages(false);
    });
    return () => unsubscribe();
  }, [conversation?.id]);
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation?.id) return;
    const userRef = doc(db, "users", user.id);
    await setDoc(
      userRef,
      {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || "",
        createdAt: new Date(),
      },
      { merge: true }
    );
    await addDoc(collection(db, "messages"), {
      conversationId: conversation.id,
      sender: userEmail,
      text: input,
      timestamp: serverTimestamp(),
    });
    const conversationRef = doc(db, "conversations", conversation.id);
    await updateDoc(conversationRef, {
      lastMessage: input,
      lastMessageTime: serverTimestamp(),
    });
    setInput("");
    scrollToBottom();
  };
  if (loadingConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-2xl shadow">
        <p className="text-gray-500">Loading conversation...</p>
      </div>
    );
  }
  if (!conversation || !conversation.users) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-2xl shadow-md p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-6 0a3 3 0 01-6 0M15 16a3 3 0 106 0m-6 0a3 3 0 016 0m-6 0h6M3 8a9 9 0 0118 0v4a9 9 0 01-18 0V8z"
          />
        </svg>
        <p className="text-gray-600 text-lg font-medium">No messages yet</p>
        <p className="text-gray-500 text-sm mt-1">Select a conversation to start chatting</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      {/* Header */}
      <MessageHeader recipientEmail={recipientEmail} />
      {/* Messages */}
      {loadingMessages ? (
        <div className="flex flex-col flex-1 justify-center items-center bg-white rounded-b-2xl shadow">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      ) : (
        <>
          <MessageContent
            messages={messages}
            userEmail={userEmail}
            endOfMessagesRef={endOfMessagesRef}
          />
          <MessageInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </>
      )}
    </div>
  );
}

// Main MessageCenter Component
const MessageCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(null);
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
          <DashboardHeader
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
