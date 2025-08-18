import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Mentors() {
  const mentors = [
    {
      id: 1,
      name: "Cameron Williamson",
      role: "Leadership Coach",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      about:
        "A seasoned UI/UX Design Mentor with over [X] years of experience in designing user-centered digital experiences. Specializing in both user in...",
      isVirtual: false,
    },
    {
      id: 2,
      name: "Cameron Williamson",
      role: "Leadership Coach",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      about:
        "A seasoned UI/UX Design Mentor with over [X] years of experience in designing user-centered digital experiences. Specializing in both user in...",
      isVirtual: true,
    },
    {
      id: 3,
      name: "Cameron Williamson",
      role: "Leadership Coach",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      about:
        "A seasoned UI/UX Design Mentor with over [X] years of experience in designing user-centered digital experiences. Specializing in both user in...",
      isVirtual: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#344054]">
          Recommended mentors
        </h2>
        <Button variant="link" className="text-[#344054]">
          View all
        </Button>
      </div>

      <div className="space-y-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className=" flex items-start gap-2 min-w-[240px] h-[65px]">
              <div className="w-[65px] aspect-square h-[65px] relative rounded-md overflow-hidden">
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  className="object-cover"
                  fill
                />
              </div>

              <div className="flex items-start flex-col">
                <h3 className="font-medium text-[17px] text-[#344054]">
                  {mentor.name}
                </h3>
                <p className="text-[15px] text-[#475467] font-semibold mb-1">
                  {mentor.role}
                </p>
                <div className="flex items-center">
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M3.91752 8.23037L1.13417 4.75118C0.960903 4.5346 0.874271 4.42631 0.812666 4.30572C0.75801 4.19874 0.718063 4.08486 0.69391 3.96718C0.666687 3.83453 0.666687 3.69585 0.666687 3.4185V2.96683C0.666687 2.22009 0.666687 1.84672 0.812012 1.56151C0.939843 1.31063 1.14382 1.10665 1.3947 0.978821C1.67992 0.833496 2.05328 0.833496 2.80002 0.833496H9.20002C9.94676 0.833496 10.3201 0.833496 10.6053 0.978821C10.8562 1.10665 11.0602 1.31063 11.188 1.56151C11.3334 1.84672 11.3334 2.22009 11.3334 2.96683V3.4185C11.3334 3.69585 11.3334 3.83453 11.3061 3.96718C11.282 4.08486 11.242 4.19874 11.1874 4.30572C11.1258 4.42631 11.0391 4.5346 10.8659 4.75118L8.08252 8.23037M1.33339 1.50016L6.00006 7.50016L10.6667 1.50016M8.35705 8.47647C9.65879 9.77822 9.65879 11.8888 8.35705 13.1905C7.0553 14.4923 4.94475 14.4923 3.643 13.1905C2.34125 11.8888 2.34125 9.77822 3.643 8.47647C4.94474 7.17473 7.05529 7.17473 8.35705 8.47647Z"
                      stroke="#8D8983"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* First 3 yellow stars (filled) */}
                  {[...Array(3)].map((_) => (
                    <Star
                      key={`yellow-${_}`}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}

                  {[...Array(2)].map((_) => (
                    <Star
                      key={`gray-${_}`}
                      size={16}
                      className="text-gray-200 fill-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h6 className="text-[#344054] text-[16px] font-semibold">
                About
              </h6>
              <p className="text-[16px] text-[#344054] line-clamp-2">
                {mentor.about}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Link href="/mentor_match/mentor/1">
                <Button
                  variant="ghost"
                  className="bg-[#334AFF] hover:bg-[#251F99] text-white hover:text-white"
                >
                  View profile
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-300">
                Book a session
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
