"use client";
import Image from "next/image";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import Header from "@/components/common/(components)/Header";
import { useState } from "react";
import MentorProfileView from "./(views)/MentorProfileView";
import BookSessionView from "./(views)/BookSessionView";

export default function MentorProfilePage() {
  const [currentView, setCurrentView] = useState<
    "book_session" | "mentor_view"
  >("mentor_view");

  const handleChangeView = (view: "book_session" | "mentor_view") => {
    setCurrentView(view);
  };

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
              name: "Profile view ",
              href: "/mentor_match/mentor/2",
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
        <div className="flex-col flex gap-y-10">
          <div className="bg-white px-6 flex flex-col gap-y-10 pb-[2rem] rounded-bl-[8px] rounded-br-[8px] border">
            <Header handleChangeView={handleChangeView} currentView={currentView} />
          </div>

          {currentView == "mentor_view" ? <MentorProfileView /> : <BookSessionView/>}
        </div>
      </main>
    </div>
  );
}
