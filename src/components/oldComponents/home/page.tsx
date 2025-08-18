import Image from "next/image";
import React from "react";
import Mentors from "./components/Mentors";
import VideoAndSessions from "./components/VideoAndSessions";
import QuickMenu from "./components/QuickMenu";
import Header from "./components/Header";

const Home = () => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <header className="relative w-full h-[189px]">
        <Image
          src="/asset/home/banner-image.jpg"
          fill
          alt="home banner"
          className="object-cover"
          priority
        />
      </header>

      {/* Centered Main Content */}
      <main className="container mx-auto px-6 flex flex-col gap-y-10 pb-[5rem]">
        <Header />

        {/* Quick Menu */}
        <QuickMenu />

        {/* How Kocha AI Works Section */}
        <VideoAndSessions />

        <Mentors />
      </main>
    </div>
  );
};

export default Home;
