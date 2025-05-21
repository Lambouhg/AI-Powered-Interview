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
    <div className="flex flex-col bg-white shadow-sm w-full md:w-[416px] border-r-2 gray-500 h-full">
      {/* Search Bar */}
      <div className="flex gap-4 items-center px-4 py-3 w-full text-base leading-relaxed text-gray-400 bg-white border-b border-gray-200">
        <Search size={24} className="self-stretch my-auto" />
        <input
          type="text"
          placeholder="Search messages"
          className="self-stretch my-auto p-2 outline-none w-full"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* New Conversation Button */}
      <button
        className="w-full py-3 bg-blue-500 text-white font-medium mt-4 mb-4 rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => toggleNewConversationDialog(true)}
      >
        Start a new conversation
      </button>

      {/* Conversation List */}
      <div className="flex flex-col mt-2 overflow-y-auto">
        {!loading &&
          filteredConversations?.map((conversation) => {
            const conversationData = conversation.data();
            const otherUser = conversationData.users.find(
              (user) => user !== userEmail
            );

            return (
              <MessageListItem
                key={conversation.id}
                id={conversation.id}
                name={otherUser || "Unknown"}
                time={
                  conversationData.lastMessageTime
                    ? new Date(
                        conversationData.lastMessageTime.toDate()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "New"
                }
                preview={
                  conversationData.lastMessage || "Start a conversation..."
                }
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
      <Dialog
        open={isOpenNewConversationDialog}
        onClose={closeNewConversationDialog}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">New Conversation</h2>
          <p className="mb-4 text-gray-600">
            Please enter an email address for the user you wish to chat with
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
              Cancel
            </Button>
            <Button
              disabled={!recipientEmail}
              onClick={createConversation}
              variant="contained"
              color="primary"
            >
              Create
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MessageList;
