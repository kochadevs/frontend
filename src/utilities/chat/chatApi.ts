import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_AXIOS_API_BASE_URL;

export interface ChatRoom {
  id: number;
  name: string;
  chat_type: "direct" | "group";
  is_public: boolean;
  date_created: string;
  last_modified: string;
  created_by: number;
}

export interface ChatMessage {
  id: number;
  date_created: string;
  last_modified: string;
  chat_room: ChatRoom;
  sender_id: number;
  content: string;
  edited: boolean;
}

export interface CreateRoomPayload {
  name: string;
  chat_type: "direct" | "group" ;
  is_public: boolean;
}



function authHeaders(token?: string | null) {
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}


export async function createChatRoom(payload: CreateRoomPayload, token?: string | null): Promise<ChatRoom> {
  const url = "/chat/utilsrooms";
  const res = await axios.post(`${API_BASE}${url}`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
  });
  return res.data as ChatRoom;
}

export async function listChatRooms(token?: string | null): Promise<ChatRoom[]> {
  const url = "/chat/utils/rooms";
  const res = await axios.get(`${API_BASE}${url}`, {
    headers: authHeaders(token),
  });
  return res.data as ChatRoom[];
}

export async function getChatRoom(roomId: number, token?: string | null): Promise<ChatRoom> {
  const url = `/chat/utils/rooms/${roomId}`;
  const res = await axios.get(`${API_BASE}${url}`, {
    headers: authHeaders(token),
  });
  return res.data as ChatRoom;
}

export async function listUserRoomMessages(token?: string | null): Promise<ChatMessage[]> {
  const url = "/chat/utils/rooms/messages";
  const res = await axios.get(`${API_BASE}${url}`, {
    headers: authHeaders(token),
  });
  return res.data as ChatMessage[];
}

export async function getRoomHistory(roomId: number, token?: string | null): Promise<ChatMessage[]> {
  const url = `/chat/utilsrooms/${roomId}/messages`;
  const res = await axios.get(`${API_BASE}${url}`, {
    headers: authHeaders(token),
  });
  return res.data as ChatMessage[];
}
