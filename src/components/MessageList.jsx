"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import MessageListItem from "./MessageListItem";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Dialog, Button, TextField } from "@mui/material";
import * as EmailValidator from "email-validator";

const MessageList = ({
  user,
  selectedConversationId,
  onSelectConversation,
}) => {
  const userEmail = user.primaryEmailAddress?.emailAddress;

  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Query conversations for current user
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", userEmail)
  );

  const [conversationsSnapshot, loading, error] = useCollection(
    queryGetConversationsForCurrentUser
  );

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
  const filteredConversations = conversationsSnapshot?.docs.filter(
    (conversation) => {
      const conversationData = conversation.data();
      const otherUser = conversationData.users.find(
        (user) => user !== userEmail
      );
      return (
        !searchInput ||
        otherUser?.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
  );

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
};

export default MessageList;
