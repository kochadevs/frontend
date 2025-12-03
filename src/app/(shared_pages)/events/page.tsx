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
import { Modal } from "antd";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { Event } from "@/interface/events";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  ExternalLink,
  ChevronRight,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";
import {
  fetchEventDetails,
  fetchIncomingEvents,
} from "@/utilities/handlers/eventsHandler";
import Loader from "@/components/common/Loader";

dayjs.extend(relativeTime);

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const accessToken = useAccessToken();

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

      const data = await fetchIncomingEvents(token);
      setEvents(data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch upcoming events";
      setError(errorMessage);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

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

      const eventDetail = await fetchEventDetails(token, eventId);
      setSelectedEvent(eventDetail);
      setViewModalVisible(true);
    } catch (err: any) {
      handleErrorMessage(err, "Failed to fetch event details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewEvent = (eventId: number) => {
    // Check if we already have the event details
    const existingEvent = events.find((event) => event.id === eventId);
    if (existingEvent) {
      setSelectedEvent(existingEvent);
      setViewModalVisible(true);
    } else {
      // Fetch event details if not in the list
      fetchEventDetail(eventId);
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const formatTime = (timeString: string) => {
    return dayjs(timeString, "HH:mm:ss").format("h:mm A");
  };

  const getEventStatus = (event: Event) => {
    const now = dayjs();
    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);

    if (now.isBefore(startDate)) {
      return {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-800",
        icon: <CalendarDays className="w-3 h-3 mr-1" />,
      };
    } else if (now.isAfter(endDate)) {
      return {
        label: "Completed",
        color: "bg-gray-100 text-gray-800",
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    } else {
      return {
        label: "Ongoing",
        color: "bg-green-100 text-green-800",
        icon: <Clock className="w-3 h-3 mr-1" />,
      };
    }
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY h:mm A");
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader text="Loading Events..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upcoming Events
        </h1>
        <p className="text-gray-600">
          Stay updated with our latest events, workshops, and gatherings
        </p>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Upcoming Events
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for upcoming events and workshops
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const status = getEventStatus(event);

            return (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                {/* Event Image */}
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <Badge
                      className={`${status.color} flex items-center gap-1`}
                    >
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-3">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {formatDate(event.start_date)}
                        </span>
                        {event.start_date !== event.end_date && (
                          <>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">
                              {formatDate(event.end_date)}
                            </span>
                          </>
                        )}
                      </div>
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

                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handleViewEvent(event.id)}
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
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
            {selectedEvent.image_url && (
              <div className="h-64 overflow-hidden rounded-lg">
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title and Status */}
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedEvent.title}
              </h2>
              {selectedEvent.is_active ? (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Inactive</Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900 whitespace-pre-line">
                {selectedEvent.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time */}
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

                {/* Location */}
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

              {/* Event Metadata */}
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
    </div>
  );
}
