import React from 'react'

const Divider = ({text}:{text:string}) => {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center text-sm/6 font-medium">
        <span className="bg-white px-6 text-gray-900 dark:bg-gray-900 dark:text-gray-300">
          {text}
        </span>
      </div>
    </div>
  );
}

export default Divider