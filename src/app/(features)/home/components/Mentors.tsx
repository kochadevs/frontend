import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Mentors() {
  const mentors = [
    {
      id: 1,
      name: "Cameron Williamson",
      role: "Leadership Coach",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      isVirtual: false,
    },
    {
      id: 2,
      name: "Virtual Mentor",
      role: "Leadership Coach",
      image:
        "https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg",
      isVirtual: true,
    },
    {
      id: 3,
      name: "Cameron Williamson",
      role: "Leadership Coach",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      isVirtual: false,
    },
    {
      id: 4,
      name: "Virtual Mentor",
      role: "Leadership Coach",
      image:
        "https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg",
      isVirtual: true,
    },
  ];

  return (
    <div className=" bg-white rounded-md p-6 border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#344054]">
          Recommended mentors
        </h2>
        <Button variant="ghost" className="text-sm text-[#344054] font-medium">
          View all
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden">
              <Image
                src={mentor.image}
                alt={mentor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8.50016C9.84095 8.50016 11.3333 7.00778 11.3333 5.16683C11.3333 3.32588 9.84095 1.8335 8 1.8335C6.15906 1.8335 4.66667 3.32588 4.66667 5.16683C4.66667 7.00778 6.15906 8.50016 8 8.50016Z"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.7267 15.1667C13.7267 12.5867 11.16 10.5 8 10.5C4.84 10.5 2.27333 12.5867 2.27333 15.1667"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="text-sm font-medium text-[#344054]">
                {mentor.name}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.16667 14.9999H8.84666C9.48666 14.9999 9.9 14.5466 9.78 13.9932L9.50667 12.7866H6.50667L6.23333 13.9932C6.11333 14.5132 6.56667 14.9999 7.16667 14.9999Z"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.50667 12.7801L10.66 11.7534C11.3067 11.1801 11.3333 10.7801 10.82 10.1334L8.78667 7.55344C8.36 7.01344 7.66 7.01344 7.23334 7.55344L5.20001 10.1334C4.68667 10.7801 4.68667 11.2001 5.36001 11.7534L6.51334 12.7801"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.00667 7.41357V9.10026"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.43333 3.4601L6.91333 2.94008C6.6 2.62674 6.6 2.12011 6.91333 1.80678L7.43333 1.28676C7.74666 0.973424 8.25333 0.973424 8.56666 1.28676L9.08666 1.80678C9.39999 2.12011 9.39999 2.62674 9.08666 2.94008L8.56666 3.4601C8.25333 3.77343 7.74666 3.77343 7.43333 3.4601Z"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.9667 6.54004H13.7C14.14 6.54004 14.5 6.90005 14.5 7.34005V8.07336C14.5 8.51336 14.14 8.87341 13.7 8.87341H12.9667C12.5267 8.87341 12.1667 8.51336 12.1667 8.07336V7.34005C12.1667 6.90005 12.5267 6.54004 12.9667 6.54004Z"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.03334 6.54004H2.3C1.86 6.54004 1.5 6.90005 1.5 7.34005V8.07336C1.5 8.51336 1.86 8.87341 2.3 8.87341H3.03334C3.47334 8.87341 3.83333 8.51336 3.83333 8.07336V7.34005C3.83333 6.90005 3.47334 6.54004 3.03334 6.54004Z"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.36 6.73352L8.82666 3.2002"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.64 6.73352L7.17333 3.2002"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="text-sm text-[#667085]">{mentor.role}</span>
            </div>
            <div className="flex items-center gap-1 mb-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.9175 8.73037L3.13415 5.25118C2.96089 5.0346 2.87426 4.92631 2.81265 4.80572C2.75799 4.69874 2.71805 4.58486 2.6939 4.46718C2.66667 4.33453 2.66667 4.19585 2.66667 3.9185V3.46683C2.66667 2.72009 2.66667 2.34672 2.812 2.06151C2.93983 1.81063 3.1438 1.60665 3.39468 1.47882C3.6799 1.3335 4.05327 1.3335 4.8 1.3335H11.2C11.9467 1.3335 12.3201 1.3335 12.6053 1.47882C12.8562 1.60665 13.0602 1.81063 13.188 2.06151C13.3333 2.34672 13.3333 2.72009 13.3333 3.46683V3.9185C13.3333 4.19585 13.3333 4.33453 13.3061 4.46718C13.282 4.58486 13.242 4.69874 13.1874 4.80572C13.1258 4.92631 13.0391 5.0346 12.8659 5.25118L10.0825 8.73037M3.33337 2.00016L8.00004 8.00016L12.6666 2.00016M10.357 8.97647C11.6588 10.2782 11.6588 12.3888 10.357 13.6905C9.05529 14.9923 6.94473 14.9923 5.64298 13.6905C4.34124 12.3888 4.34124 10.2782 5.64298 8.97647C6.94472 7.67473 9.05528 7.67473 10.357 8.97647Z"
                  stroke="#8D8983"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {[1, 2, 3].map((star) => (
                <Image
                  key={star}
                  src="/asset/home/Star icon.svg"
                  alt="Star"
                  width={16}
                  height={16}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1 bg-linear-to-r from-[#334AFF] to-[#1F2C99] text-white py-2 px-4 rounded-lg text-sm font-medium">
                View profile
              </Button>
              <button className="flex-1 border border-gray-300 text-[#344054] py-2 px-4 rounded-lg text-sm font-medium">
                Send message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
