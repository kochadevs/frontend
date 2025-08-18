"use client";

import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import RichEditor from "./components/rich-editor";

export default function CoverLetter() {
  return (
    <main className="min-h-screen pb-[4rem]">
      <div className="py-[10px] md:px-20 px-5 h-[40px] bg-white border-b fixed w-full z-50">
        <Breadcrumb
          start={{
            name: "Documents",
            href: "/documents",
            current: false,
          }}
          steps={[
            {
              name: "Create Resume",
              href: `/documents/create-resume`,
              current: true,
            },
          ]}
        />
      </div>
      <div className="container mx-auto pt-20 pb-6  px-10">
        <RichEditor />
      </div>
    </main>
  );
}
