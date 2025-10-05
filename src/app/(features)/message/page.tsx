"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import SearchField from "@/components/common/SearchField";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Divider from "@/components/common/Divider";

// Types
interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  avatar?: string;
  type: "sent" | "received";
}

interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  avatar?: string;
  unread?: boolean;
}

interface WebSocketMessage {
  type:
    | "message"
    | "conversation_update"
    | "user_typing"
    | "error"
    | "connection_ack";
  data: {
    id?: string;
    sender?: string;
    senderId?: string;
    content?: string;
    timestamp?: string;
    conversationId?: string;
    conversations?: Conversation[];
    typing?: boolean;
    userId?: string;
  };
}

export default function Messaging() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: "user-1", name: "You" }); // You'd get this from auth

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket("ws://35.238.249.192:8095/api/v1/chat/ws");

        ws.current.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);

          // Send initial connection message to get conversations
          if (ws.current?.readyState === WebSocket.OPEN) {
            const initMessage: WebSocketMessage = {
              type: "connection_ack",
              data: {
                userId: currentUser.id,
              },
            };
            ws.current.send(JSON.stringify(initMessage));
          }
        };

        ws.current.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            handleIncomingMessage(message);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.current.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [currentUser.id]);

  // Handle incoming WebSocket messages
  const handleIncomingMessage = (message: WebSocketMessage) => {
    console.log("Received message:", message);

    switch (message.type) {
      case "message":
        if (
          message.data.content &&
          message.data.sender &&
          message.data.conversationId
        ) {
          const newMessage: Message = {
            id: message.data.id || Date.now().toString(),
            sender: message.data.sender,
            senderId: message.data.senderId || "unknown",
            content: message.data.content,
            timestamp:
              message.data.timestamp ||
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            avatar:
              message.data.sender === "You"
                ? ""
                : getAvatarForUser(message.data.sender),
            type:
              message.data.senderId === currentUser.id ? "sent" : "received",
          };

          setMessages((prev) => [...prev, newMessage]);

          // Update conversation last message
          if (message.data.conversationId) {
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === message.data.conversationId
                  ? {
                      ...conv,
                      lastMessage: message.data.content,
                      lastMessageTime: newMessage.timestamp,
                      unread: conv.id !== selectedConversation,
                    }
                  : conv
              )
            );
          }
        }
        break;

      case "conversation_update":
        if (message.data.conversations) {
          setConversations(message.data.conversations);
        }
        break;

      case "user_typing":
        // Handle typing indicators (you can implement this later)
        console.log("User typing:", message.data);
        break;

      case "connection_ack":
        console.log("Connection acknowledged by server");
        break;

      case "error":
        console.error("WebSocket error:", message.data.content);
        break;

      default:
        console.warn("Unknown message type:", message);
    }
  };

  // Helper function to get avatar (you can replace this with actual user data)
  const getAvatarForUser = (username: string): string => {
    const avatarMap: { [key: string]: string } = {
      "Phoenix Baker":
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Alex Johnson":
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };
    return avatarMap[username] || "";
  };

  // Send message via WebSocket
  const sendMessage = (content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return false;
    }

    if (!selectedConversation) {
      console.error("No conversation selected");
      return false;
    }

    const message: WebSocketMessage = {
      type: "message",
      data: {
        content: content,
        conversationId: selectedConversation,
        senderId: currentUser.id,
        sender: currentUser.name,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      ws.current.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageContent.trim() && isConnected && selectedConversation) {
      setIsLoading(true);

      // Add message to UI immediately (optimistic update)
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        sender: currentUser.name,
        senderId: currentUser.id,
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "",
        type: "sent",
      };

      setMessages((prev) => [...prev, tempMessage]);

      // Update conversation last message optimistically
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? {
                ...conv,
                lastMessage: messageContent,
                lastMessageTime: tempMessage.timestamp,
              }
            : conv
        )
      );

      // Send via WebSocket
      const success = sendMessage(messageContent);

      if (!success) {
        // If sending fails, mark message as failed
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, content: `${msg.content} (Failed to send)` }
              : msg
          )
        );
      }

      setMessageContent("");
      setIsLoading(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [messageContent]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setMessages([]);
      // Mark conversation as read
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation ? { ...conv, unread: false } : conv
        )
      );

      // In a real app, you'd request messages for this conversation from the server
      console.log("Loading messages for conversation:", selectedConversation);
    }
  }, [selectedConversation]);

  const selectedConversationData = conversations.find(
    (c) => c.id === selectedConversation
  );

  return (
    <div className="container mx-auto flex flex-col gap-y-[1.5rem] px-4 py-6 h-full max-h-screen">
      <header>
        <h2 className="text-[24px] font-bold text-gray-700">Messaging</h2>
        <p className="text-black-shade-900 text-[15px]">
          Connect with other influencers, brands, and collaborate with the
          community to drive success together.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </header>

      <main className="border rounded-[8px] bg-white flex items-start w-full flex-1 min-h-[550px] overflow-hidden">
        {/* Conversations Sidebar */}
        <aside className="border-r w-full md:w-[458px] flex flex-col h-full">
          <header className="p-[8px] border-b">
            <SearchField
              clsName="md:!w-full"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search conversations..."
            />
          </header>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <p>
                  {isConnected ? "No conversations found" : "Connecting..."}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`h-[125px] cursor-pointer py-[10px] px-[24px] flex items-center gap-4 w-full hover:bg-[#F2F4F7] border-l-[3px] ${
                    selectedConversation === conversation.id
                      ? "border-l-[#00A498] bg-[#F0FAF9]"
                      : "border-l-transparent"
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <Avatar className="w-[64px] h-[64px] object-center flex-shrink-0">
                    <AvatarImage
                      src={conversation.avatar}
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="font-bold text-[#344054] text-[17px] truncate">
                        {conversation.name}
                      </h2>
                      <span className="text-[#667085] text-[14px] whitespace-nowrap ml-2">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-black-shade-900 text-[15px] truncate">
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-[#00A498] rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <aside className="flex-1 flex flex-col h-full min-h-0">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="w-[40px] h-[40px]">
                    <AvatarImage src={selectedConversationData?.avatar} />
                    <AvatarFallback>
                      {selectedConversationData?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[#344054]">
                      {selectedConversationData?.name}
                    </h3>
                    <p className="text-[#667085] text-sm">
                      {isConnected ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              <Divider text="Today" />

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.type === "sent" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {message.type === "received" && (
                        <Avatar className="w-[34px] h-[34px] flex-shrink-0">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[70%] ${
                          message.type === "sent" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-x-[6px] mb-1 ${
                            message.type === "sent" ? "justify-end" : ""
                          }`}
                        >
                          <h2 className="font-semibold text-[#344054] text-[16px]">
                            {message.sender}
                          </h2>
                          <span className="font-medium text-[#667085] text-[14px]">
                            {message.timestamp}
                          </span>
                        </div>
                        <div
                          className={`inline-block px-4 py-2 rounded-2xl text-[15px] ${
                            message.type === "sent"
                              ? "bg-[#00A498] text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-gray-50 border-t flex-shrink-0">
                <div className="flex flex-col gap-2 border rounded-[8px] p-3 bg-white">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Type your message here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="border-0 shadow-none min-h-[60px] max-h-[120px] resize-none focus:!ring-0 focus-visible:ring-0"
                    rows={1}
                    disabled={!isConnected || isLoading}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="bg-transparent hover:bg-gray-100 w-[32px] h-[32px] p-0"
                        disabled={!isConnected}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M9 9H9.01M15 9H15.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                            stroke="#667085"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="bg-transparent hover:bg-gray-100 w-[32px] h-[32px] p-0"
                        disabled={!isConnected}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21ZM5 21L16 10L21 15M10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5Z"
                            stroke="#667085"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="bg-transparent hover:bg-gray-100 w-[32px] h-[32px] p-0"
                        disabled={!isConnected}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8M14 2L20 8M14 2V8H20M16 13H8M16 17H8M10 9H8"
                            stroke="#667085"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        !messageContent.trim() || !isConnected || isLoading
                      }
                      className="bg-[#00A498] hover:bg-[#00857a] text-white"
                    >
                      {isLoading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // No conversation selected state
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  No Conversation Selected
                </h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
