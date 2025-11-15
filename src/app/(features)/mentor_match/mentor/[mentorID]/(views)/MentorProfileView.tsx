import About from "@/components/common/(components)/About";
import Certification from "@/components/common/(components)/Certification";
import Education from "@/components/common/(components)/Education";
import Experience from "@/components/common/(components)/Experience";
import Skill from "@/components/common/(components)/Skill";
import { Mentor } from "@/interface/mentors";
import CareerGoals from "@/components/common/(components)/CareerGoals";

type MentorProfileViewProps = {
  mentor?: Mentor | null;
};

export default function MentorProfileView({
  mentor,
}: Readonly<MentorProfileViewProps>) {
  return (
    <>
      <About mentor={mentor} />
      <CareerGoals careerGoals={mentor?.career_goals} />
      <Skill mentor={mentor} />
      <Experience />
      <Education />
      <Certification />
    </>
  );
}
