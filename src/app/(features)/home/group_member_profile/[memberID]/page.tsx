import About from "@/components/common/(components)/About";
import Certification from "@/components/common/(components)/Certification";
import Education from "@/components/common/(components)/Education";
import Experience from "@/components/common/(components)/Experience";
import Header from "@/components/common/(components)/Header";
import Language from "@/components/common/(components)/Language";
import Posts from "@/components/common/(components)/Posts";
import Skill from "@/components/common/(components)/Skill";
import Image from "next/image";


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
