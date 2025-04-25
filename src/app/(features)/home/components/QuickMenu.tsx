import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const QuickMenu = () => {
  return (
    <div className="min-h-[344px] border rounded-md p-[16px]">
      <h3 className="text-[#344054] font-semibold text-[16px]">Quick Menu</h3>
      <div className=" grid md:grid-cols-2 gap-4 mt-4 h-full">
        <Link href="/documents">
          <div className="bg-white p-4 rounded-md shadow-lg hover:shadow-xl transition cursor-pointer h-[132px] border">
            <div className="flex items-center gap-4">
              <div className="bg-[#B9E6FE] h-[100px] w-[97px] p-3 rounded-md flex items-center justify-center">
                <div className="w-[48px] h-[48px] relative">
                  <Image
                    src="/asset/home/document-icon.svg"
                    fill
                    alt="document  icon"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#344054] text-[18px]">
                  Generate resume
                </h2>
                <p className="text-[16px] text-[#344054]">Create new</p>
              </div>
              <div className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#BED8FF] overflow-hidden">
                <Image
                  src="/asset/home/arrow-right.svg"
                  width={24}
                  height={24}
                  alt="arrow right"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/documents">
          <div className="bg-white p-4 rounded-md shadow-lg hover:shadow-xl transition cursor-pointer h-[132px] border">
            <div className="flex items-center gap-4">
              <div className="bg-[#F9DBAF] h-[100px] w-[97px] p-3 rounded-md flex items-center justify-center">
                <div className="w-[48px] h-[48px] relative">
                  <Image
                    src="/asset/home/document-icon.svg"
                    fill
                    alt="document  icon"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#344054] text-[18px]">
                  Create New Cover letter
                </h2>
                <p className="text-[16px] text-[#344054]">Create new</p>
              </div>
              <div className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#BED8FF] overflow-hidden">
                <Image
                  src="/asset/home/arrow-right.svg"
                  width={24}
                  height={24}
                  alt="arrow right"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/jobs">
          <div className="bg-white p-4 rounded-md shadow-lg hover:shadow-xl transition cursor-pointer h-[132px] border">
            <div className="flex items-center gap-4">
              <div className="bg-[#ECE9FE] h-[100px] w-[97px] p-3 rounded-md flex items-center justify-center">
                <div className="w-[48px] h-[48px] relative">
                  <Image
                    src="/asset/home/letter-icon.svg"
                    fill
                    alt="document  icon"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#344054] text-[18px]">
                  Apply for your first job
                </h2>
                <p className="text-[16px] text-[#344054]">
                  Apply for your first job on Simplify with a few clicks.
                </p>
              </div>
              <div className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#BED8FF] overflow-hidden">
                <Image
                  src="/asset/home/arrow-right.svg"
                  width={24}
                  height={24}
                  alt="arrow right"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/jobs">
          <div className="bg-white p-4 rounded-md shadow-lg hover:shadow-xl transition cursor-pointer h-[132px] border">
            <div className="flex items-center gap-4">
              <div className="bg-[#CEEAB0] h-[100px] w-[97px] p-3 rounded-md flex items-center justify-center">
                <div className="w-[48px] h-[48px] relative">
                  <Image
                    src="/asset/home/bag-icon.svg"
                    fill
                    alt="document  icon"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#344054] text-[18px]">
                  Explore job lists
                </h2>
                <p className="text-[16px] text-[#344054]">
                  Browse a curated job lists that matches your interests.
                </p>
              </div>
              <div className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#BED8FF] overflow-hidden">
                <Image
                  src="/asset/home/arrow-right.svg"
                  width={24}
                  height={24}
                  alt="arrow right"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default QuickMenu