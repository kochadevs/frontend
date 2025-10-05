import React from "react";

type SearchFieldProps = {
  clsName?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

const SearchField = ({ 
  clsName, 
  value, 
  onChange, 
  placeholder = "Search..." 
}: SearchFieldProps) => {
  return (
    <div
      className={`${clsName} relative w-full md:w-[320px] overflow-hidden bg-white rounded-lg`}
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400"
        >
          <path
            d="M13 13.0005L9.53537 9.53585M9.53537 9.53585C10.4731 8.59814 10.9999 7.32632 10.9999 6.00019C10.9999 4.67406 10.4731 3.40224 9.53537 2.46452C8.59765 1.5268 7.32583 1 5.9997 1C4.67357 1 3.40175 1.5268 2.46403 2.46452C1.52632 3.40224 0.999512 4.67406 0.999512 6.00019C0.999512 7.32632 1.52632 8.59814 2.46403 9.53585C3.40175 10.4736 4.67357 11.0004 5.9997 11.0004C7.32583 11.0004 8.59765 10.4736 9.53537 9.53585Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg"
      />
    </div>
  );
};

export default SearchField;
