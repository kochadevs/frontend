import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tokenUtils } from "@/utilities/cookies";
import { Event } from "@/interface/events";
import { useAccessToken } from "@/store/authStore";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { fetchIncomingEvents } from "@/utilities/handlers/eventsHandler";

dayjs.extend(relativeTime);

interface EventsComponentProps {
  maxEvents?: number;
}

export default function EventsComponent({
  maxEvents = 3,
}: Readonly<EventsComponentProps>) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAccessToken();

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        console.warn("No access token available to fetch events");
        return;
      }

      const upcomingEvents = await fetchIncomingEvents(token);
      setEvents(upcomingEvents.slice(0, maxEvents));
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, maxEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD");
  };

  const formatTime = (timeString: string) => {
    return dayjs(timeString, "HH:mm:ss").format("h:mm A");
  };

  const getEventTimeFromNow = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <Link href="/events">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No upcoming events</p>
          <p className="text-gray-400 text-xs mt-1">
            Check back later for events
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="group p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
            >
              <Link href={`/events`} className="block">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {event.title}
                  </h4>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-2">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{formatDate(event.start_date)}</span>
                    {event.start_date !== event.end_date && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{formatDate(event.end_date)}</span>
                      </>
                    )}
                    <span className="text-gray-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{formatTime(event.start_time)}</span>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  {/* Time from now */}
                  <div className="text-xs text-blue-600 font-medium">
                    {getEventTimeFromNow(event.start_date)}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {events.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total upcoming events</span>
            <span className="font-semibold text-gray-900">{events.length}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Next event:{" "}
            {events.length > 0
              ? getEventTimeFromNow(events[0].start_date)
              : "No events"}
          </div>
        </div>
      )}
    </Card>
  );
}
