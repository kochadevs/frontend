/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  Input,
  DatePicker,
  TimePicker,
  Form,
  Select,
  Switch,
  message,
} from "antd";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { Event, EventPayload } from "@/interface/events";
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  CalendarDays,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Power,
  Search,
  Filter,
  Upload as UploadIcon,
  X,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  fetchAllEventsAdmin,
  CreateEvent,
  fetchEventDetailsAdmin,
  UpdateEventDetailsAdmin,
  DeleteEventAdmin,
  DeactivateEventAdmin,
} from "@/utilities/handlers/eventsHandler";
import Loader from "@/components/common/Loader";
import Image from "next/image";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";

dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Option } = Select;

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);

  // Selected event states
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Form states
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createUploadedFile, setCreateUploadedFile] = useState<File | null>(
    null
  );
  const [createUploadPreview, setCreateUploadPreview] = useState<string | null>(
    null
  );
  const [editUploadedFile, setEditUploadedFile] = useState<File | null>(null);
  const [editUploadPreview, setEditUploadPreview] = useState<string | null>(
    null
  );
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const accessToken = useAccessToken();

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false;
    try {
      if (url.startsWith("data:image/")) return true;
      if (url.startsWith("/")) return true;
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      const data = await fetchAllEventsAdmin(token);
      setEvents(data);
      message.success("Events loaded successfully");
    } catch (err: any) {
      handleErrorMessage(err, "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch event details
  const fetchEventDetail = async (eventId: number) => {
    try {
      setDetailsLoading(true);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      const eventDetail = await fetchEventDetailsAdmin(token, eventId);
      setSelectedEvent(eventDetail);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to fetch event details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle view event
  const handleViewEvent = async (eventId: number) => {
    // Check if we already have the event details
    const existingEvent = events.find((event) => event.id === eventId);
    if (existingEvent) {
      setSelectedEvent(existingEvent);
      setViewModalVisible(true);
    } else {
      // Fetch event details if not in the list
      await fetchEventDetail(eventId);
      setViewModalVisible(true);
    }
  };

  // Handle create event
  const handleCreateEvent = async (values: any) => {
    try {
      setIsCreating(true);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      // Convert image file to base64 if uploaded
      let imageBase64 = "";
      if (createUploadedFile) {
        try {
          imageBase64 = await convertFileToBase64(createUploadedFile);
        } catch (err: any) {
          console.error(err, "Failed to process image. Please try again.");
          setIsCreating(false);
          return;
        }
      }

      // Convert date and time to proper format
      const payload: EventPayload = {
        title: values.title,
        description: values.description,
        start_date: dayjs(values.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(values.end_date).format("YYYY-MM-DD"),
        start_time: dayjs(values.start_time).format("HH:mm"),
        end_time: dayjs(values.end_time).format("HH:mm"),
        location: values.location,
        image_url: imageBase64 || "", // Send base64 string
      };

      const newEvent = await CreateEvent(token, payload);

      // Add new event to the list
      setEvents((prev) => [newEvent, ...prev]);

      message.success("Event created successfully");
      setCreateModalVisible(false);
      createForm.resetFields();
      handleRemoveCreateFile();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle edit event
  const handleEditEvent = async (values: any) => {
    if (!selectedEvent) return;

    try {
      setIsUpdating(true);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      // Convert image file to base64 if a new file is uploaded
      let imageBase64 = selectedEvent.image_url; // Keep existing image by default
      if (editUploadedFile) {
        try {
          imageBase64 = await convertFileToBase64(editUploadedFile);
        } catch (err: any) {
          console.error(err, "Failed to process image. Please try again.");
          setIsUpdating(false);
          return;
        }
      }

      // Convert date and time to proper format
      const payload: EventPayload = {
        title: values.title || selectedEvent.title,
        description: values.description || selectedEvent.description,
        start_date: values.start_date
          ? dayjs(values.start_date).format("YYYY-MM-DD")
          : selectedEvent.start_date,
        end_date: values.end_date
          ? dayjs(values.end_date).format("YYYY-MM-DD")
          : selectedEvent.end_date,
        start_time: values.start_time
          ? dayjs(values.start_time).format("HH:mm")
          : selectedEvent.start_time,
        end_time: values.end_time
          ? dayjs(values.end_time).format("HH:mm")
          : selectedEvent.end_time,
        location: values.location || selectedEvent.location,
        image_url: imageBase64, // Use the base64 string
        is_active: editIsActive,
      };

      const updatedEvent = await UpdateEventDetailsAdmin(
        token,
        selectedEvent.id,
        payload
      );

      // Update event in the list
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );

      message.success("Event updated successfully");
      setEditModalVisible(false);
      setSelectedEvent(updatedEvent);
      handleRemoveEditFile();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to update event");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      setIsDeleting(true);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      await DeleteEventAdmin(token, selectedEvent.id);

      // Remove event from the list
      setEvents((prev) =>
        prev.filter((event) => event.id !== selectedEvent.id)
      );

      message.success("Event deleted successfully");
      setDeleteModalVisible(false);
      setSelectedEvent(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle deactivate/activate event
  const handleToggleEventStatus = async () => {
    if (!selectedEvent) return;

    try {
      setIsDeactivating(true);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      const updatedEvent = await DeactivateEventAdmin(token, selectedEvent.id);

      // Update event in the list
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );

      const action = updatedEvent.is_active ? "activated" : "deactivated";
      message.success(`Event ${action} successfully`);
      setDeactivateModalVisible(false);
      setSelectedEvent(updatedEvent);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to update event status"
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  // File handling for create modal
  const handleCreateFileSelect = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      message.error("Please upload only image files (JPEG, PNG, GIF, WebP)");
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      message.error("File size must be less than 5MB");
      return false;
    }

    setCreateUploadedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCreateUploadPreview(previewUrl);
    return true;
  };

  const handleRemoveCreateFile = () => {
    if (createUploadPreview) {
      URL.revokeObjectURL(createUploadPreview);
    }
    setCreateUploadedFile(null);
    setCreateUploadPreview(null);
  };

  // File handling for edit modal
  const handleEditFileSelect = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      message.error("Please upload only image files (JPEG, PNG, GIF, WebP)");
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      message.error("File size must be less than 5MB");
      return false;
    }

    setEditUploadedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setEditUploadPreview(previewUrl);
    return true;
  };

  const handleRemoveEditFile = () => {
    if (editUploadPreview) {
      URL.revokeObjectURL(editUploadPreview);
    }
    setEditUploadedFile(null);
    setEditUploadPreview(null);
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const formatTime = (timeString: string) => {
    return dayjs(`2000-01-01 ${timeString}`).format("h:mm A");
  };

  const getEventStatus = (event: Event) => {
    const now = dayjs();
    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    if (!event.is_active) {
      return {
        label: "Inactive",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      };
    } else if (now.isBefore(startDate)) {
      return {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <CalendarDays className="w-3 h-3 mr-1" />,
      };
    } else if (now.isAfter(endDate)) {
      return {
        label: "Completed",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    } else {
      return {
        label: "Ongoing",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    }
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY h:mm A");
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && event.is_active) ||
      (filterStatus === "inactive" && !event.is_active);

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchEvents();
  }, [accessToken]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (createUploadPreview) {
        URL.revokeObjectURL(createUploadPreview);
      }
      if (editUploadPreview) {
        URL.revokeObjectURL(editUploadPreview);
      }
    };
  }, [createUploadPreview, editUploadPreview]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader text="Loading Events..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Events
            </h1>
            <p className="text-gray-600">
              Manage all events, workshops, and gatherings
            </p>
          </div>
          <Button
            onClick={() => setCreateModalVisible(true)}
            className="flex items-center gap-2 bg-[#251F99] hover:bg-[#251F99]/90"
          >
            <Plus className="w-4 h-4" />
            Create New Event
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-40"
              size="large"
            >
              <Option value="all">All Events</Option>
              <Option value="active">Active Only</Option>
              <Option value="inactive">Inactive Only</Option>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Unable to Load Events
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={fetchEvents}
              variant="outline"
              className="border-red-300 text-red-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Active Events</p>
                <p className="text-2xl font-bold">
                  {events.filter((event) => event.is_active).length}
                </p>
              </div>
              <CalendarDays className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold">
                  {
                    events.filter(
                      (event) =>
                        event.is_active &&
                        dayjs().isBefore(dayjs(event.start_date))
                    ).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">
                  {
                    events.filter((event) =>
                      dayjs().isAfter(dayjs(event.end_date))
                    ).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first event to get started"}
            </p>
            <Button
              onClick={() => setCreateModalVisible(true)}
              className="bg-[#251F99] hover:bg-[#251F99]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);

            return (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group border relative"
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    className={`${status.color} border flex items-center gap-1`}
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
                </div>

                {/* Event Image */}
                {event.image_url && isValidUrl(event.image_url) ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image_url}
                      alt={event.title || "Event image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="p-6 rounded-lg bg-white/50 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {event.title || "Untitled Event"}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {event.description || "No description available"}
                  </p>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {formatDate(event.start_date)}
                        {event.start_date !== event.end_date && (
                          <> - {formatDate(event.end_date)}</>
                        )}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {formatTime(event.start_time)} -{" "}
                        {formatTime(event.end_time)}
                      </span>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm line-clamp-1">
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0 border-t">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      onClick={() => handleViewEvent(event.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedEvent(event);
                          setEditIsActive(event.is_active);
                          editForm.setFieldsValue({
                            title: event.title,
                            description: event.description,
                            start_date: dayjs(event.start_date),
                            end_date: dayjs(event.end_date),
                            start_time: dayjs(`2000-01-01 ${event.start_time}`),
                            end_time: dayjs(`2000-01-01 ${event.end_time}`),
                            location: event.location,
                          });
                          setEditModalVisible(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedEvent(event);
                          setDeleteModalVisible(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Create New Event</span>
          </div>
        }
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
          handleRemoveCreateFile();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateEvent}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: "Please enter event title" }]}
          >
            <Input placeholder="Enter event title" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter event description" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter event description"
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="start_date"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker className="w-full" size="large" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="end_date"
              label="End Date"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker className="w-full" size="large" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="start_time"
              label="Start Time"
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <TimePicker className="w-full" size="large" format="HH:mm" />
            </Form.Item>

            <Form.Item
              name="end_time"
              label="End Time"
              rules={[{ required: true, message: "Please select end time" }]}
            >
              <TimePicker className="w-full" size="large" format="HH:mm" />
            </Form.Item>
          </div>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter event location" }]}
          >
            <Input placeholder="Enter event location" size="large" />
          </Form.Item>

          <Form.Item label="Event Image (Optional)">
            <div className="space-y-4">
              {!createUploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#251F99] transition-colors cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 rounded-full bg-gray-100">
                      <UploadIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            handleCreateFileSelect(file);
                          }
                        };
                        input.click();
                      }}
                    >
                      Select Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {createUploadedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(createUploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCreateFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {createUploadPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </p>
                      <div className="relative h-48 w-full overflow-hidden rounded-md border">
                        <Image
                          fill
                          src={createUploadPreview}
                          alt="Preview"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                  handleRemoveCreateFile();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#251F99] hover:bg-[#251F99]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            <span>Edit Event</span>
          </div>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          handleRemoveEditFile();
        }}
        footer={null}
        width={600}
      >
        {selectedEvent && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditEvent}
            className="mt-4"
          >
            <Form.Item name="title" label="Event Title">
              <Input placeholder="Enter event title" size="large" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea
                rows={4}
                placeholder="Enter event description"
                size="large"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="start_date" label="Start Date">
                <DatePicker
                  className="w-full"
                  size="large"
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item name="end_date" label="End Date">
                <DatePicker
                  className="w-full"
                  size="large"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="start_time" label="Start Time">
                <TimePicker className="w-full" size="large" format="HH:mm" />
              </Form.Item>

              <Form.Item name="end_time" label="End Time">
                <TimePicker className="w-full" size="large" format="HH:mm" />
              </Form.Item>
            </div>

            <Form.Item name="location" label="Location">
              <Input placeholder="Enter event location" size="large" />
            </Form.Item>

            {/* Active Toggle */}
            <Form.Item label="Event Status">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Event Active</p>
                  <p className="text-sm text-gray-500">
                    {editIsActive
                      ? "Event is visible to users"
                      : "Event is hidden from users"}
                  </p>
                </div>
                <Switch
                  checked={editIsActive}
                  onChange={setEditIsActive}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  className={editIsActive ? "bg-green-600" : "bg-gray-400"}
                />
              </div>
            </Form.Item>

            {/* Image Upload for Edit */}
            <Form.Item label="Event Image">
              <div className="space-y-4">
                {/* Show current image */}
                {selectedEvent.image_url &&
                  isValidUrl(selectedEvent.image_url) &&
                  !editUploadedFile && (
                    <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-md border">
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Current Image
                            </p>
                            <p className="text-sm text-gray-500">
                              From event URL
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-48 w-full overflow-hidden rounded-md border">
                        <Image
                          fill
                          src={selectedEvent.image_url}
                          alt="Current event image"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                {/* Upload new image */}
                {!editUploadedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#251F99] transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-3 rounded-full bg-gray-100">
                        <UploadIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          Click to upload new image
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) {
                              handleEditFileSelect(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        Select New Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-md border">
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {editUploadedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            New image •{" "}
                            {(editUploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveEditFile}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {editUploadPreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          New Image Preview:
                        </p>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border">
                          <Image
                            fill
                            src={editUploadPreview}
                            alt="Preview"
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditModalVisible(false);
                    editForm.resetFields();
                    handleRemoveEditFile();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#251F99] hover:bg-[#251F99]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Event"
                  )}
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* View Event Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span>Event Details</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedEvent(null);
        }}
        footer={[
          <Button
            key="edit"
            onClick={() => {
              setViewModalVisible(false);
              setEditIsActive(selectedEvent?.is_active || true);
              editForm.setFieldsValue({
                title: selectedEvent?.title,
                description: selectedEvent?.description,
                start_date: selectedEvent
                  ? dayjs(selectedEvent.start_date)
                  : null,
                end_date: selectedEvent ? dayjs(selectedEvent.end_date) : null,
                start_time: selectedEvent
                  ? dayjs(`2000-01-01 ${selectedEvent.start_time}`)
                  : null,
                end_time: selectedEvent
                  ? dayjs(`2000-01-01 ${selectedEvent.end_time}`)
                  : null,
                location: selectedEvent?.location,
              });
              setEditModalVisible(true);
            }}
            variant="outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>,
          <Button
            key="status"
            onClick={() => {
              setViewModalVisible(false);
              setDeactivateModalVisible(true);
            }}
            variant={selectedEvent?.is_active ? "outline" : "default"}
            className={`mx-2 ${
              selectedEvent?.is_active ? "text-red-600 hover:text-red-700" : ""
            }`}
          >
            <Power className="w-4 h-4 mr-2" />
            {selectedEvent?.is_active ? "Deactivate" : "Activate"}
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setViewModalVisible(false);
              setSelectedEvent(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {detailsLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading event details...</p>
          </div>
        ) : selectedEvent ? (
          <div className="mt-4 space-y-6">
            {/* Event Image */}
            {selectedEvent.image_url && isValidUrl(selectedEvent.image_url) ? (
              <div className="relative h-64 overflow-hidden rounded-lg">
                <Image
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title || "Event image"}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="p-12 rounded-lg bg-white/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600">Event image not available</p>
                </div>
              </div>
            )}

            {/* Title and Status */}
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedEvent.title || "Untitled Event"}
              </h2>
              <Badge
                className={
                  selectedEvent.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {selectedEvent.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900 whitespace-pre-line">
                {selectedEvent.description || "No description available"}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Date & Time
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {formatDate(selectedEvent.start_date)}
                        {selectedEvent.start_date !==
                          selectedEvent.end_date && (
                          <> to {formatDate(selectedEvent.end_date)}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {formatTime(selectedEvent.start_time)} -{" "}
                        {formatTime(selectedEvent.end_time)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Location
                    </h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {selectedEvent.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Event Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-gray-900">
                        {formatDateTime(selectedEvent.date_created)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-gray-900">
                        {formatDateTime(selectedEvent.last_modified)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event ID</p>
                      <p className="text-gray-900 font-mono">
                        #{selectedEvent.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Event details not available</p>
          </div>
        )}
      </Modal>

      {/* Delete Event Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>Delete Event</span>
          </div>
        }
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedEvent(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setDeleteModalVisible(false);
              setSelectedEvent(null);
            }}
            variant="outline"
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            onClick={handleDeleteEvent}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </Button>,
        ]}
        width={400}
      >
        {selectedEvent && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Are you sure you want to delete this event?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">
                  {selectedEvent.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedEvent.start_date)} •{" "}
                  {selectedEvent.location}
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    This action cannot be undone
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    All event data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Deactivate/Activate Event Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Power className="w-5 h-5" />
            <span>
              {selectedEvent?.is_active ? "Deactivate" : "Activate"} Event
            </span>
          </div>
        }
        open={deactivateModalVisible}
        onCancel={() => {
          setDeactivateModalVisible(false);
          setSelectedEvent(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setDeactivateModalVisible(false);
              setSelectedEvent(null);
            }}
            variant="outline"
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            onClick={handleToggleEventStatus}
            variant={selectedEvent?.is_active ? "destructive" : "default"}
            className={
              selectedEvent?.is_active
                ? ""
                : "bg-[#251F99] hover:bg-[#251F99]/90"
            }
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {selectedEvent?.is_active ? "Deactivating..." : "Activating..."}
              </>
            ) : selectedEvent?.is_active ? (
              "Deactivate"
            ) : (
              "Activate"
            )}
          </Button>,
        ]}
        width={400}
      >
        {selectedEvent && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedEvent.is_active ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <Power
                  className={`w-8 h-8 ${
                    selectedEvent.is_active ? "text-red-600" : "text-green-600"
                  }`}
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                {selectedEvent.is_active
                  ? "Deactivate this event?"
                  : "Activate this event?"}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">
                  {selectedEvent.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedEvent.start_date)} •{" "}
                  {selectedEvent.location}
                </p>
              </div>
            </div>

            <div
              className={`rounded-lg p-4 ${
                selectedEvent.is_active
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  className={`w-5 h-5 mt-0.5 ${
                    selectedEvent.is_active ? "text-red-600" : "text-green-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${
                      selectedEvent.is_active
                        ? "text-red-800"
                        : "text-green-800"
                    }`}
                  >
                    {selectedEvent.is_active
                      ? "Deactivated events won't be visible to users"
                      : "Activated events will be visible to users"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      selectedEvent.is_active
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedEvent.is_active
                      ? "Users won't be able to see or register for this event."
                      : "Users will be able to see and register for this event."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
