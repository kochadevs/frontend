import React from "react";

interface LoaderProp {
  text: string;
  cls?: string;
}

const Loader = ({ text, cls }: LoaderProp) => {
  return (
    <div
      className={` ${cls} max-w-2xl mx-auto px-4 text-center h-screen flex flex-col justify-center items-center`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334AFF] mx-auto"></div>
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
};

export default Loader;
