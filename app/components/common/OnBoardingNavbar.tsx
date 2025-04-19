import Image from 'next/image';
import React from 'react'

const OnBoardingNavbar = () => {
  return (
    <nav className="w-screen bg-white h-[72px] py-[10px] px-[24px] flex items-center justify-center shadow-md shadow-[#E5E7EB]">
      <div className="w-full h-full flex items-center">
        <div className="relative w-[144.66px] h-[38px] ">
          <Image
            src="/asset/kocha_logo.png"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </nav>
  );
}

export default OnBoardingNavbar