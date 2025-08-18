import Image from "next/image";
import Header from "./(components)/Header";
import About from "./(components)/About";
import Posts from "./(components)/Posts";
import Experience from "./(components)/Experience";
import Education from "./(components)/Education";
import Certification from "./(components)/Certification";
import Skill from "./(components)/Skill";
import Language from "./(components)/Language";

export default function GroupMemberProfile() {
  return (
    <div>
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
            <Header />
          </div>
          <About />
          <Posts />
          <Experience />
          <Education />
          <Certification />
          <Skill />
          <Language />
        </div>
      </main>
    </div>
  );
}
