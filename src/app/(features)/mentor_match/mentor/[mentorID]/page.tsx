"use client";
import Image from "next/image";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Header from "@/components/common/(components)/Header";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMentorById } from "@/utilities/handlers/mentorHandler";
import { Mentor } from "@/interface/mentors";
import { useAccessToken, useUser } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import MentorProfileView from "./(views)/MentorProfileView";
import BookSessionView from "./(views)/BookSessionView";

export default function MentorProfilePage() {
  const [currentView, setCurrentView] = useState<
    "book_session" | "mentor_view"
  >("mentor_view");
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const accessToken = useAccessToken();
  const user = useUser();
  const mentorId = params.mentorID as string;
  const isMentor = user?.user_type === "mentor";

  // Redirect mentors away from mentor match pages
  useEffect(() => {
    if (user && isMentor) {
      toast.error(
        "Mentors cannot access mentor profiles through Mentor Match."
      );
      router.push("/home");
    }
  }, [user, isMentor, router]);

  const handleChangeView = (view: "book_session" | "mentor_view") => {
    setCurrentView(view);
  };

  const loadMentor = async () => {
    if (!mentorId) return;

    setIsLoading(true);
    setError(null);
    try {
      // Try to get token from store first, then from cookies as fallback
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        setError("Please sign in to view mentor profile.");
        return;
      }

      const mentorData = await getMentorById(token, mentorId);
      setMentor(mentorData);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load mentor profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMentor();
  }, [mentorId, accessToken, loadMentor]);

  // Show loading while checking user type
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content for mentors (they will be redirected)
  if (isMentor) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="relative">
        <header className="bg-white h-[70px] z-50 sticky top-0 w-full px-[16px] py-[25px] flex items-center border-b">
          <Breadcrumb
            start={{
              name: "Mentor match",
              href: "/mentor_match",
              current: false,
            }}
            steps={[
              {
                name: "Loading...",
                href: `#`,
                current: true,
              },
            ]}
          />
        </header>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#334AFF]" />
            <p className="text-gray-600">Loading mentor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !mentor) {
    return (
      <div className="relative">
        <header className="bg-white h-[70px] z-50 sticky top-0 w-full px-[16px] py-[25px] flex items-center border-b">
          <Breadcrumb
            start={{
              name: "Mentor match",
              href: "/mentor_match",
              current: false,
            }}
            steps={[
              {
                name: "Error",
                href: "#",
                current: true,
              },
            ]}
          />
        </header>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Mentor not found"}</p>
            <button
              onClick={loadMentor}
              className="px-4 py-2 bg-[#334AFF] text-white rounded-md hover:bg-[#251F99]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <header className="bg-white h-[70px] z-50 sticky top-0 w-full px-[16px] py-[25px] flex items-center border-b">
        <Breadcrumb
          start={{
            name: "Mentor match",
            href: "/mentor_match",
            current: false,
          }}
          steps={[
            {
              name: `${mentor.first_name} ${mentor.last_name || ""}`.trim(),
              href: `#`,
              current: true,
            },
          ]}
        />
      </header>
      {/* Centered Main Content */}
      <main className="container mx-auto pb-[5rem] relative px-[16px]">
        {/* Banner Image */}
        <header className="relative w-full h-[189px]">
          <Image
            src="/asset/home/member_profile_banner.png"
            fill
            alt="home banner"
            className="object-cover"
            priority
          />
        </header>
        <div className="flex-col flex gap-y-4">
          <div className="bg-white px-6 flex flex-col gap-y-10 pb-[2rem] rounded-bl-[8px] rounded-br-[8px] border">
            <Header
              handleChangeView={handleChangeView}
              currentView={currentView}
              mentor={mentor}
            />
          </div>

          {currentView == "mentor_view" ? (
            <MentorProfileView mentor={mentor} />
          ) : (
            <BookSessionView mentor={mentor} />
          )}
        </div>
      </main>
    </div>
  );
}
