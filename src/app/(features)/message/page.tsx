"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect, useCallback } from "react";
import SearchField from "@/components/common/SearchField";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Divider from "@/components/common/Divider";
import { useAuth } from "@/store/authStore";
import { useChatWS, ActionMessage } from "@/utilities/chatWS";
import { listChatRooms, listUserRoomMessages, ChatRoom, getRoomHistory, ChatMessage } from "@/utilities/chatApi";
import CreateRoomModal from "@/components/CreateRoomModal";
import toast from "react-hot-toast";
import { Conversation, Message } from "@/interface/messageChat";


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
  const recipientId = 3// Default recipient ID
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Scroll only the messages container to avoid page jump that hides nav
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleIncomingMessage = useCallback((message: ActionMessage) => {
    if (message.action === "message" && message.message?.content) {
      const newMessage: Message = {
        id: message.message.id || Date.now().toString(),
        sender: message.message.sender_id === user?.id ? "You" : `User ${message.message.sender_id}`,
        senderId: message.message.sender_id?.toString() || "unknown",
        content: message.message.content,
        timestamp:
          message.message.timestamp ?
          new Date(message.message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) :
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        avatar: message.message.sender_id === user?.id ? "" : getAvatarForUser(`User ${message.message.sender_id}`),
        type: message.message.sender_id === user?.id ? "sent" : "received",
      };

      setMessages((prev) => [...prev, newMessage]);

      // Update conversation last message
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
  }, [user?.id, selectedConversation]);

  const { isConnected, roomId: _, sendMessage: wsSendMessage } = useChatWS({
    accessToken,
    recipientId,
    currentUserId: user?.id,
    onMessage: handleIncomingMessage,
  });

  // Load rooms from API
  const loadRooms = async () => {
    if (!accessToken) return;
    
    try {
      const roomsData = await listChatRooms(accessToken);
      setRooms(roomsData);
      
      // Fetch all user room messages once and compute latest per room
    const allMessages = await listUserRoomMessages(accessToken);
      const latestByRoom = new Map<number, ChatMessage>();
      for (const msg of allMessages) {
        const rid = msg.chat_room?.id;
        if (typeof rid !== 'number') continue;
        const existing = latestByRoom.get(rid);
        if (!existing || new Date(msg.date_created).getTime() > new Date(existing.date_created).getTime()) {
          latestByRoom.set(rid, msg);
        }
      }
      
      // Convert rooms to conversations format for existing UI using latest message per room
      const roomConversations: Conversation[] = roomsData.map((room) => {
        const latest = latestByRoom.get(room.id);
        const lastMessage = latest ? latest.content : "No messages yet";
        const lastMessageTime = latest ? new Date(latest.date_created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
        return {
          id: room.id.toString(),
          name: room.name,
          participants: [user?.id?.toString() || "1", room.created_by.toString()],
          lastMessage,
          lastMessageTime,
          avatar: "",
          unread: false,
        };
      });
      
      setConversations(roomConversations);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      toast.error("Failed to load chat rooms");
    }
  };

  const handleRoomCreated = (room: ChatRoom) => {
    setRooms((prev) => [...prev, room]);
    
    // Add to conversations
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
  };

  // Load messages for a specific room
  const loadRoomMessages = async (roomId: number) => {
    if (!accessToken) return;
    
    try {
      const messagesData = await getRoomHistory(roomId, accessToken);

      // Ensure ascending order (oldest -> newest) so newest is at the bottom
      const sorted = [...messagesData].sort(
        (a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
      );
      
      // Convert API messages to UI format
      const formattedMessages: Message[] = sorted.map((msg) => ({
        id: msg.id.toString(),
        sender: msg.sender_id === user?.id ? "You" : `User ${msg.sender_id}`,
        senderId: msg.sender_id.toString(),
        content: msg.content,
        timestamp: new Date(msg.date_created).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: msg.sender_id === user?.id ? "" : getAvatarForUser(`User ${msg.sender_id}`),
        type: msg.sender_id === user?.id ? "sent" : "received",
      }));
      
      setMessages(formattedMessages);
      
      // Update sidebar conversation with the latest message/time
      setConversations((prev) => prev.map((conv) => {
        if (conv.id !== roomId.toString()) return conv;
        if (formattedMessages.length === 0) {
          return { ...conv, lastMessage: "No messages yet", lastMessageTime: "" };
        }
        const last = formattedMessages[formattedMessages.length - 1];
        return { ...conv, lastMessage: last.content, lastMessageTime: last.timestamp };
      }));
    } catch (error) {
      console.error("Failed to load room messages:", error);
      toast.error("Failed to load messages");
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


  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageContent.trim() && isConnected && selectedConversation) {
      setIsLoading(true);
      
      const selectedRoomId = parseInt(selectedConversation);

      // Add message to UI immediately (optimistic update)
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

      // Send via WebSocket with the selected room ID
      const success = wsSendMessage(messageContent, selectedRoomId);

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

  // Scroll to bottom of the messages container (not the page) when messages change
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setMessages([]); // Clear current messages
      
      // Mark conversation as read
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation ? { ...conv, unread: false } : conv
        )
      );

      // Load messages for this room
      const roomId = parseInt(selectedConversation);
      if (!isNaN(roomId)) {
        loadRoomMessages(roomId);
      }
    }
  }, [selectedConversation, accessToken]);

  // Load rooms on component mount
  useEffect(() => {
    loadRooms();
  }, [accessToken]);

  const selectedConversationData = conversations.find(
    (c) => c.id === selectedConversation
  );

  return (
    <div className="flex flex-col gap-y-[1.5rem] p-4 h-[90vh] max-h-screen">
      <header className="flex-shrink-0">
        <h2 className="text-[24px] font-bold text-gray-700">Messaging</h2>
        <p className="text-black-shade-900 text-[15px]">
          Connect with other influencers, brands, and collaborate with the
          community to drive success together.
        </p>
      </header>

      <main className="border rounded-[8px] bg-white flex items-stretch w-full flex-1 min-h-0 overflow-hidden">
        {/* Conversations Sidebar */}
        <aside className="border-r w-full md:w-[458px] flex flex-col min-h-0">
          <header className="p-[8px] border-b space-y-2 flex-shrink-0">
            <SearchField
              clsName="md:!w-full"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search conversations..."
            />
            <div className="flex justify-end">
              <CreateRoomModal onRoomCreated={handleRoomCreated} />
            </div>
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
        <aside className="flex-1 flex flex-col min-h-0">
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
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
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
                        !messageContent.trim() || !isConnected || isLoading || !selectedConversation
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
