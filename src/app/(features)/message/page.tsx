/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect, useCallback } from "react";
import SearchField from "@/components/common/SearchField";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";
import { useChatWS, ActionMessage } from "@/utilities/chat/chatWS";
import {
  listChatRooms,
  listUserRoomMessages,
  ChatRoom,
  getRoomHistory,
  ChatMessage,
} from "@/utilities/chat/chatApi";
import CreateRoomModal from "@/components/CreateRoomModal";
import toast from "react-hot-toast";
import { Conversation, Message } from "@/interface/messageChat";
import { ChevronLeft, Info, X, MessageSquare } from "lucide-react";

export default function Messaging() {
  const { accessToken, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Responsive state
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });
  const [showChat, setShowChat] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const recipientId = 3; // Default recipient ID

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Screen size detection
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock data for the design layout
  const mockConversations = [
    {
      id: "1",
      name: "Supardi_Kencur",
      lastMessage: "12",
      lastMessageTime: "",
      avatar: "",
      participants: [],
      unread: false,
    },
    {
      id: "2",
      name: "Pestutmahakami2",
      lastMessage: "4",
      lastMessageTime: "",
      avatar: "",
      participants: [],
      unread: false,
      platform: "Instagram",
    },
    {
      id: "3",
      name: "+621234567890",
      lastMessage: "132",
      lastMessageTime: "",
      avatar: "",
      participants: [],
      unread: false,
      platform: "Whatsapp",
    },
    {
      id: "4",
      name: "Hursein Saddam",
      lastMessage: "2",
      lastMessageTime: "",
      avatar: "",
      participants: [],
      unread: false,
      platform: "LinkedIn",
    },
    {
      id: "5",
      name: "Vladimir.basuki",
      lastMessage: "16",
      lastMessageTime: "",
      avatar: "",
      participants: [],
      unread: false,
      platform: "Tiktok",
    },
  ];

  const mockDirectMessages = [
    { id: "6", name: "Alfredo Workman", preview: "H. I noticed a squ..." },
    { id: "7", name: "Kisma George", preview: "H. I noticed a squ..." },
    { id: "8", name: "Ann Schleifer", preview: "H. I noticed a squ..." },
    { id: "9", name: "Craig Culhane", preview: "H. I noticed a squ..." },
  ];

  const mockMessages = [
    {
      id: "1",
      sender: "You",
      senderId: "1",
      content:
        "Hey! Did you check out that new café downtown? I heard they have the best lattes.",
      timestamp: "10:00",
      avatar: "",
      type: "sent" as const,
    },
    {
      id: "2",
      sender: "Ann Schleifer",
      senderId: "8",
      content:
        "I actually went there yesterday. The lattes are amazing, and the ambience is super cozy.",
      timestamp: "10:05",
      avatar: "",
      type: "received" as const,
    },
    {
      id: "3",
      sender: "You",
      senderId: "1",
      content:
        "I've been wanting to try their pastries too. Were they any good?",
      timestamp: "10:06",
      avatar: "",
      type: "sent" as const,
    },
  ];

  const getAvatarForUser = useCallback((username: string): string => {
    const avatarMap: { [key: string]: string } = {
      "Phoenix Baker":
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Alex Johnson":
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "Ann Schleifer":
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };
    return avatarMap[username] || "";
  }, []);

  const handleIncomingMessage = useCallback(
    (message: ActionMessage) => {
      if (message.action === "message" && message.message?.content) {
        const newMessage: Message = {
          id: message.message.id || Date.now().toString(),
          sender:
            message.message.sender_id === user?.id
              ? "You"
              : `User ${message.message.sender_id}`,
          senderId: message.message.sender_id?.toString() || "unknown",
          content: message.message.content,
          timestamp: message.message.timestamp
            ? new Date(message.message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
          avatar:
            message.message.sender_id === user?.id
              ? ""
              : getAvatarForUser(`User ${message.message.sender_id}`),
          type: message.message.sender_id === user?.id ? "sent" : "received",
        };

        setMessages((prev) => [...prev, newMessage]);

        if (message.room_id) {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === message.room_id?.toString()
                ? {
                    ...conv,
                    lastMessage: message.message?.content,
                    lastMessageTime: newMessage.timestamp,
                    unread: conv.id !== selectedConversation,
                  }
                : conv
            )
          );
        }
      }
    },
    [user?.id, selectedConversation, getAvatarForUser]
  );

  const { isConnected, sendMessage: wsSendMessage } = useChatWS({
    accessToken,
    recipientId,
    currentUserId: user?.id,
    onMessage: handleIncomingMessage,
  });

  const loadRoomMessages = useCallback(
    async (roomId: number) => {
      if (!accessToken) return;

      try {
        const messagesData = await getRoomHistory(roomId, accessToken);

        const sorted = [...messagesData].sort(
          (a, b) =>
            new Date(a.date_created).getTime() -
            new Date(b.date_created).getTime()
        );

        const formattedMessages: Message[] = sorted.map((msg) => ({
          id: msg.id.toString(),
          sender: msg.sender_id === user?.id ? "You" : `User ${msg.sender_id}`,
          senderId: msg.sender_id.toString(),
          content: msg.content,
          timestamp: new Date(msg.date_created).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar:
            msg.sender_id === user?.id
              ? ""
              : getAvatarForUser(`User ${msg.sender_id}`),
          type: msg.sender_id === user?.id ? "sent" : "received",
        }));

        setMessages(formattedMessages);

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== roomId.toString()) return conv;
            if (formattedMessages.length === 0) {
              return {
                ...conv,
                lastMessage: "No messages yet",
                lastMessageTime: "",
              };
            }
            const last = formattedMessages[formattedMessages.length - 1];
            return {
              ...conv,
              lastMessage: last.content,
              lastMessageTime: last.timestamp,
            };
          })
        );
      } catch (error) {
        console.error("Failed to load room messages:", error);
        toast.error("Failed to load messages");
      }
    },
    [accessToken, user?.id, getAvatarForUser]
  );

  const loadRooms = useCallback(async () => {
    if (!accessToken) return;

    try {
      const roomsData = await listChatRooms(accessToken);
      const allMessages = await listUserRoomMessages(accessToken);
      const latestByRoom = new Map<number, ChatMessage>();

      for (const msg of allMessages) {
        const rid = msg.chat_room?.id;
        if (typeof rid !== "number") continue;
        const existing = latestByRoom.get(rid);
        if (
          !existing ||
          new Date(msg.date_created).getTime() >
            new Date(existing.date_created).getTime()
        ) {
          latestByRoom.set(rid, msg);
        }
      }

      const roomConversations: Conversation[] = roomsData.map((room) => {
        const latest = latestByRoom.get(room.id);
        const lastMessage = latest ? latest.content : "No messages yet";
        const lastMessageTime = latest
          ? new Date(latest.date_created).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
        return {
          id: room.id.toString(),
          name: room.name,
          participants: [
            user?.id?.toString() || "1",
            room.created_by.toString(),
          ],
          lastMessage,
          lastMessageTime,
          avatar: "",
          unread: false,
        };
      });

      // Use mock data for demonstration
      setConversations([...mockConversations, ...roomConversations]);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      // Use mock data as fallback
      setConversations(mockConversations);
    }
  }, [accessToken, user?.id]);

  const handleRoomCreated = useCallback(
    (room: ChatRoom) => {
      const newConversation: Conversation = {
        id: room.id.toString(),
        name: room.name,
        participants: [user?.id?.toString() || "1", room.created_by.toString()],
        lastMessage: "Room created",
        lastMessageTime: new Date(room.date_created).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "",
        unread: false,
      };

      setConversations((prev) => [newConversation, ...prev]);
    },
    [user?.id]
  );

  // Handle conversation selection with responsive behavior
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);

    if (isMobile) {
      setShowChat(true);
    }

    // For mock conversations, use mock messages
    if (conversationId === "8") {
      // Ann Schleifer
      setMessages(mockMessages);
    } else {
      setMessages([]);
      const roomId = parseInt(conversationId);
      if (!isNaN(roomId)) {
        loadRoomMessages(roomId);
      }
    }
  };

  // Handle back to conversations on mobile
  const handleBackToConversations = () => {
    setShowChat(false);
    setSelectedConversation(null);
  };

  // Toggle info panel based on screen size
  const toggleInfoPanel = () => {
    if (isMobile) {
      setShowInfo(!showInfo);
    } else {
      setShowInfo(!showInfo);
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

      const selectedRoomId = parseInt(selectedConversation);

      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        sender: user?.first_name || "You",
        senderId: user?.id?.toString() || "unknown",
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "",
        type: "sent",
      };

      setMessages((prev) => [...prev, tempMessage]);

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

      const success = wsSendMessage(messageContent, selectedRoomId);

      if (!success) {
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [messageContent]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages([]);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation ? { ...conv, unread: false } : conv
        )
      );

      // For mock conversations, use mock messages
      if (selectedConversation === "8") {
        // Ann Schleifer
        setMessages(mockMessages);
      } else {
        const roomId = parseInt(selectedConversation);
        if (!isNaN(roomId)) {
          loadRoomMessages(roomId);
        }
      }
    }
  }, [selectedConversation, loadRoomMessages]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const selectedConversationData = conversations.find(
    (c) => c.id === selectedConversation
  );

  // Responsive layout classes
  const getLeftPanelClass = () => {
    if (isMobile) return showChat ? "hidden" : "flex w-full";
    if (isTablet) return "flex w-[280px]";
    return "flex w-[280px]";
  };

  const getChatPanelClass = () => {
    if (isMobile) return showChat ? "flex w-full" : "hidden";
    if (isTablet) return showInfo ? "flex flex-1" : "flex flex-1";
    return showInfo ? "flex flex-1" : "flex flex-1";
  };

  const getInfoPanelClass = () => {
    if (isMobile) return "hidden"; // Always hidden on mobile (shown as modal)
    if (isTablet) return showInfo ? "flex w-[300px]" : "hidden";
    return showInfo ? "flex w-[300px]" : "hidden";
  };

  return (
    <div className="flex flex-col gap-y-[1.5rem] p-4 h-[87vh] max-h-screen">
      {/* Header */}
      <header className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-gray-700">Messaging</h2>
            <p className="text-black-shade-900 text-[15px]">
              Connect with Mentors in the community to drive success together.
            </p>
          </div>

          {/* Mobile header controls */}
          {isMobile && showChat && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleInfoPanel}
                className="flex items-center gap-2"
              >
                <Info size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToConversations}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                <MessageSquare size={16} />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="border rounded-[8px] bg-white flex items-stretch w-full flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <aside
          className={`border-r flex flex-col min-h-0 flex-shrink-0 ${getLeftPanelClass()}`}
        >
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-700">Message category</h3>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || "husselin.saidiam@gmail.com"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Search */}
            <div className="p-3 border-b space-y-2">
              <SearchField
                clsName="w-full"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search Message..."
              />
              <div className="flex justify-end">
                <CreateRoomModal onRoomCreated={handleRoomCreated} />
              </div>
            </div>

            {/* Conversations List */}
            <div className="py-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="text-xs">
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {conversation.name}
                      </h4>
                      {(conversation as any).platform && (
                        <p className="text-xs text-gray-500">
                          {(conversation as any).platform}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                    {conversation.lastMessage}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct Messages Section */}
            <div className="border-t pt-3">
              <h4 className="px-4 text-sm font-semibold text-gray-700 mb-2">
                Direct Message
              </h4>
              {mockDirectMessages.map((dm) => (
                <div
                  key={dm.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === dm.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelectConversation(dm.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {dm.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{dm.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Middle Column - Chat Area */}
        <aside
          className={`flex flex-col min-h-0 border-r ${getChatPanelClass()}`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Mobile back button */}
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToConversations}
                        className="mr-2"
                      >
                        <ChevronLeft size={20} />
                      </Button>
                    )}

                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          selectedConversationData?.avatar ||
                          getAvatarForUser(selectedConversationData?.name || "")
                        }
                      />
                      <AvatarFallback>
                        {selectedConversationData?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversationData?.name}
                      </h3>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Today</p>
                      <p className="text-sm text-gray-500">10:05</p>
                    </div>

                    {/* Info toggle button for tablet/desktop */}
                    {!isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleInfoPanel}
                        className={`ml-2 ${showInfo ? "bg-gray-100" : ""}`}
                      >
                        <Info size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info Bar - Hidden on mobile when info modal is available */}
              {!isMobile && (
                <>
                  <div className="px-4 py-2 border-b bg-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={getAvatarForUser("Ann Schleifer")} />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">
                        Anna Schleifer
                      </span>
                      <span className="text-sm text-gray-500">
                        ann_Schleifer22
                      </span>
                    </div>
                  </div>

                  {/* Shared Items */}
                  <div className="px-4 py-2 border-b bg-gray-50 flex-shrink-0">
                    <div className="flex gap-4 text-sm">
                      <button className="text-gray-700 hover:text-gray-900">
                        Shared Document
                      </button>
                      <button className="text-gray-700 hover:text-gray-900">
                        Shared Media
                      </button>
                      <button className="text-gray-700 hover:text-gray-900">
                        Shared Post
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-gray-50"
              >
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
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage
                            src={
                              message.avatar || getAvatarForUser(message.sender)
                            }
                          />
                          <AvatarFallback className="text-xs">
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
                          className={`flex items-center gap-2 mb-1 ${
                            message.type === "sent" ? "justify-end" : ""
                          }`}
                        >
                          {message.type === "received" && (
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {message.sender}
                            </h4>
                          )}
                          <span className="text-xs text-gray-500">
                            {message.timestamp}
                          </span>
                        </div>
                        <div
                          className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                            message.type === "sent"
                              ? "bg-[#251F99] text-white"
                              : "bg-white text-gray-700 border"
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
              <div className="p-4 bg-white border-t flex-shrink-0">
                <div className="flex flex-col gap-2 border rounded-lg p-3 bg-white">
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
                        className="bg-transparent hover:bg-gray-100 w-8 h-8 p-0"
                        disabled={!isConnected}
                      >
                        <svg
                          width="20"
                          height="20"
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
                        className="bg-transparent hover:bg-gray-100 w-8 h-8 p-0"
                        disabled={!isConnected}
                      >
                        <svg
                          width="20"
                          height="20"
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
                        className="bg-transparent hover:bg-gray-100 w-8 h-8 p-0"
                        disabled={!isConnected}
                      >
                        <svg
                          width="20"
                          height="20"
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
                        !messageContent.trim() ||
                        !isConnected ||
                        isLoading ||
                        !selectedConversation
                      }
                      className="bg-[#251F99] hover:bg-[#251F99]/90 text-white px-6"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
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

        {/* Right Sidebar - Additional Info */}
        <aside
          className={`flex flex-col min-h-0 flex-shrink-0 bg-white ${getInfoPanelClass()}`}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Shareable</h3>
            <Button variant="ghost" size="sm" onClick={toggleInfoPanel}>
              <X size={16} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 text-sm mb-2">
                Casual hangout in the centre of the residential area of
                kortegede
              </h4>
              <p className="text-xs text-gray-600">
                Hey! Did you check out that new café downtown? I heard they have
                the best lattes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium text-gray-900">New (Yan) |</span>
                <span className="text-gray-600">
                  {" "}
                  actually went there yesterday. The lattes are amazing, and the
                  ambience is super cozy.
                </span>
              </div>

              <div className="text-sm">
                <span className="font-medium text-gray-900">You |</span>
                <span className="text-gray-600">
                  {" "}
                  I&apos;ve been wanting to try their pastries too. Were they
                  any good?
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Info Modal */}
      {isMobile && showInfo && (
        <div className="fixed inset-0 bg-[#000000a6] bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Conversation Info</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(false)}
              >
                <X size={16} />
              </Button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Shared Content
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                      Shared Documents
                    </button>
                    <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                      Shared Media
                    </button>
                    <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                      Shared Posts
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 text-sm mb-2">
                    Casual hangout in the centre of the residential area of
                    kortegede
                  </h4>
                  <p className="text-xs text-gray-600">
                    Hey! Did you check out that new café downtown? I heard they
                    have the best lattes.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      New (Yan) |
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      actually went there yesterday. The lattes are amazing...
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-900">You |</span>
                    <span className="text-gray-600">
                      {" "}
                      I&apos;ve been wanting to try their pastries too...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
