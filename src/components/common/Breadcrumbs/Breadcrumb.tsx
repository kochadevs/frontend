import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

interface BreadcrumbProps {
  start: {
    name: string;
    href: string;
    current: boolean;
  };
  steps: {
    name: string;
    href: string;
    current: boolean;
  }[];
}

export default function Breadcrumb({ start, steps }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              href={start.href}
              className="text-gray-400 hover:text-gray-500"
            >
              <span>{start.name}</span>
            </Link>
          </div>
        </li>
        {steps.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                aria-hidden="true"
                className="size-5 shrink-0 text-gray-400"
              />
              <Link
                href={page.href}
                aria-current={page.current ? "page" : undefined}
                className={`ml-4 text-sm font-medium  ${
                  page.current === true
                    ? "text-[#2032E2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
