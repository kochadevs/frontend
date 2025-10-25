// Types
export interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  avatar?: string;
  type: "sent" | "received";
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  avatar?: string;
  unread?: boolean;
}