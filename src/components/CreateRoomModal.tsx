/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { createChatRoom, ChatRoom, CreateRoomPayload } from "@/utilities/chatApi";
import { useAuth } from "@/store/authStore";
import toast from "react-hot-toast";

interface CreateRoomModalProps {
  onRoomCreated?: (room: ChatRoom) => void;
  triggerButton?: React.ReactNode;
}

export default function CreateRoomModal({
  onRoomCreated,
  triggerButton,
}: CreateRoomModalProps) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRoomPayload>({
    name: "",
    chat_type: "direct",
    is_public: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const room = await createChatRoom(formData, accessToken);
      toast.success(`Room "${room.name}" created successfully!`);
      onRoomCreated?.(room);
      setOpen(false);
      
      // Reset form
      setFormData({
        name: "",
        chat_type: "direct",
        is_public: false,
      });
    } catch (error: any) {
      console.error("Failed to create room:", error);
      toast.error(error?.response?.data?.message || "Failed to create room");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button size="sm" className="bg-[#00A498] hover:bg-[#00857a] text-white">
      <Plus className="h-4 w-4 mr-1" />
      Create Room
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
            <DialogDescription>
              Create a new chat room to start conversations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter room name..."
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="chat_type">Room Type</Label>
              <Select
                value={formData.chat_type}
                onValueChange={(value: "direct" | "group") =>
                  setFormData((prev) => ({ ...prev, chat_type: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_public" className="text-sm font-medium">
                Public Room
              </Label>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_public: checked }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#00A498] hover:bg-[#00857a]"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}