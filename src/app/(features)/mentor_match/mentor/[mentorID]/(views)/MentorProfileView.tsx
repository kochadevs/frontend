import About from "@/components/common/(components)/About";
import Certification from "@/components/common/(components)/Certification";
import Education from "@/components/common/(components)/Education";
import Experience from "@/components/common/(components)/Experience";
import Language from "@/components/common/(components)/Language";
import Posts from "@/components/common/(components)/Posts";
import Skill from "@/components/common/(components)/Skill";

export default function MentorProfileView() {
  return (
    <>
      <About />
      <Posts />
      <Experience />
      <Education />
      <Certification />
      <Skill />
      <Language />
    </>
  );
}
