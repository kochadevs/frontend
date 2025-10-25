import About from "@/components/common/(components)/About";
import Certification from "@/components/common/(components)/Certification";
import Education from "@/components/common/(components)/Education";
import Experience from "@/components/common/(components)/Experience";
import Language from "@/components/common/(components)/Language";
import Posts from "@/components/common/(components)/Posts";
import Skill from "@/components/common/(components)/Skill";
import { Mentor } from "@/interface/mentors";

type MentorProfileViewProps = {
  mentor?: Mentor | null;
};

export default function MentorProfileView({ mentor }: Readonly<MentorProfileViewProps>) {
  return (
    <>
      <About mentor={mentor} />
      <Posts />
      <Experience />
      <Education />
      <Certification />
      <Skill mentor={mentor} />
      <Language />
    </>
  );
}
