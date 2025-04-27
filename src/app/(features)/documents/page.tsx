"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"resume" | "cover-letter">(
    "resume"
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const documents = [
    {
      id: 1,
      name: "Login",
      created: "21 Sep, 2020",
      lastEdited: "8 Sep, 2024",
      status: "Active",
    },
    {
      id: 2,
      name: "matching",
      created: "17 Feb, 2020",
      lastEdited: "24 May, 2024",
      status: "In-active",
    },
    {
      id: 3,
      name: "Notion",
      created: "8 Sep, 2020",
      lastEdited: "21 Sep, 2024",
      status: "In-active",
    },
    {
      id: 4,
      name: "Sourcetree",
      created: "24 May, 2020",
      lastEdited: "17 Oct, 2024",
      status: "In-active",
    },
    {
      id: 5,
      name: "frello",
      created: "17 Oct, 2020",
      lastEdited: "22 Oct, 2024",
      status: "In-active",
    },
    {
      id: 6,
      name: "Netflix",
      created: "22 Oct, 2020",
      lastEdited: "1 Feb, 2024",
      status: "In-active",
    },
  ];

  // Filter documents based on status
  const filteredDocuments =
    statusFilter === "all"
      ? documents
      : documents.filter((doc) => doc.status === statusFilter);

  return (
    <main className="min-h-screen pb-[4rem]">
      <div className="container mx-auto p-6">
        <h1 className="text-[30px] font-bold text-[#2E3646] mb-1">Documents</h1>
        <p className="text-[18px] text-[#344054] mb-8">
          Manage and tailor all of your job search documents here
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Generate resume card */}
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

          {/* Create New Cover letter card */}
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
        </div>

        {/* Documents table */}
        <div className="overflow-x-auto bg-white shadow rounded-md border">
          <div className="flex md:items-center items-start justify-between md:flex-row flex-col  p-4 ">
            {/* Filter section */}
            <div className="flex items-center gap-2 bg-[#F2F4F7] rounded-md overflow-hidden md:mb-0 mb-2">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("resume")}
                className={`font-[400] h-[40px]  transition-all cursor-pointer px-3 py-2 text-[16px] text-[#344054] rounded-md ${
                  activeTab === "resume"
                    ? "bg-[#fff] hover:bg-[#fff] border border-[#EAECF0]"
                    : "bg-transparent"
                }`}
              >
                Resumes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("cover-letter")}
                className={`font-[400] h-[40px] transition-all cursor-pointer px-3 py-2 text-[16px] text-[#344054] rounded-md ${
                  activeTab === "cover-letter"
                    ? "bg-[#fff] hover:bg-[#fff] border border-[#EAECF0]"
                    : "bg-transparent"
                }`}
              >
                Cover letters
              </Button>
            </div>

            {/* Search and filter */}
            <div className="flex md:items-center items-start justify-between  md:flex-row flex-col gap-4 md:w-auto w-full">
              <div className="relative md:flex-1 md:max-w-[320px] w-full">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]"
                >
                  <path
                    d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                    stroke="#667085"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Input type="text" placeholder="Search" className="pl-10 " />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="In-active">In-active</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Documents table */}
          <div className="border">
            {activeTab === "resume" ? (
              <Table>
                <TableHeader className="bg-[#F9FAFB] px-[24px] py-[12px]">
                  <TableRow>
                    <TableHead>Resume name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last edited</TableHead>
                    <TableHead className="w-[200px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-transparent">
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.created}</TableCell>
                      <TableCell>{doc.lastEdited}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="hover:bg-gray-100 rounded-sm cursor-pointer">
                            <svg
                              width="34"
                              height="34"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M27.5 22.5V25.8333C27.5 26.2754 27.3244 26.6993 27.0118 27.0118C26.6993 27.3244 26.2754 27.5 25.8333 27.5H14.1667C13.7246 27.5 13.3007 27.3244 12.9882 27.0118C12.6756 26.6993 12.5 26.2754 12.5 25.8333V22.5M15.8333 18.3333L20 22.5M20 22.5L24.1667 18.3333M20 22.5V12.5"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-sm">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.833374 10.0002C0.833374 10.0002 4.16671 3.3335 10 3.3335C15.8334 3.3335 19.1667 10.0002 19.1667 10.0002C19.1667 10.0002 15.8334 16.6668 10 16.6668C4.16671 16.6668 0.833374 10.0002 0.833374 10.0002Z"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 12.5002C11.3808 12.5002 12.5 11.3809 12.5 10.0002C12.5 8.61945 11.3808 7.50016 10 7.50016C8.61933 7.50016 7.50004 8.61945 7.50004 10.0002C7.50004 11.3809 8.61933 12.5002 10 12.5002Z"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 18 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 15.6667H16.5M12.75 1.91669C13.0815 1.58517 13.5312 1.39893 14 1.39893C14.2321 1.39893 14.462 1.44465 14.6765 1.53349C14.891 1.62233 15.0858 1.75254 15.25 1.91669C15.4142 2.08085 15.5444 2.27572 15.6332 2.4902C15.722 2.70467 15.7678 2.93455 15.7678 3.16669C15.7678 3.39884 15.722 3.62871 15.6332 3.84319C15.5444 4.05766 15.4142 4.25254 15.25 4.41669L4.83333 14.8334L1.5 15.6667L2.33333 12.3334L12.75 1.91669Z"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="hover:bg-gray-100 rounded-sm cursor-pointer">
                            <svg
                              width="34"
                              height="34"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.5 14.9998H14.1667M14.1667 14.9998H27.5M14.1667 14.9998V26.6665C14.1667 27.1085 14.3423 27.5325 14.6548 27.845C14.9674 28.1576 15.3913 28.3332 15.8333 28.3332H24.1667C24.6087 28.3332 25.0326 28.1576 25.3452 27.845C25.6577 27.5325 25.8333 27.1085 25.8333 26.6665V14.9998H14.1667ZM16.6667 14.9998V13.3332C16.6667 12.8911 16.8423 12.4672 17.1548 12.1547C17.4674 11.8421 17.8913 11.6665 18.3333 11.6665H21.6667C22.1087 11.6665 22.5326 11.8421 22.8452 12.1547C23.1577 12.4672 23.3333 12.8911 23.3333 13.3332V14.9998M18.3333 19.1665V24.1665M21.6667 19.1665V24.1665"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <div
                          className={`px-2 py-1 text-[13px] rounded-full text-center font-medium  ${
                            doc.status === "Active"
                              ? "bg-[#ECFDF3] text-[#027A48]"
                              : "bg-[#F2F4F7] text-[#344054]"
                          }`}
                        >
                          {doc.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader className="bg-[#F9FAFB] px-[24px] py-[12px]">
                  <TableRow>
                    <TableHead>Cover letter name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last edited</TableHead>
                    <TableHead className="w-[200px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-transparent">
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.created}</TableCell>
                      <TableCell>{doc.lastEdited}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="hover:bg-gray-100 rounded-sm cursor-pointer">
                            <svg
                              width="34"
                              height="34"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M27.5 22.5V25.8333C27.5 26.2754 27.3244 26.6993 27.0118 27.0118C26.6993 27.3244 26.2754 27.5 25.8333 27.5H14.1667C13.7246 27.5 13.3007 27.3244 12.9882 27.0118C12.6756 26.6993 12.5 26.2754 12.5 25.8333V22.5M15.8333 18.3333L20 22.5M20 22.5L24.1667 18.3333M20 22.5V12.5"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-sm">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.833374 10.0002C0.833374 10.0002 4.16671 3.3335 10 3.3335C15.8334 3.3335 19.1667 10.0002 19.1667 10.0002C19.1667 10.0002 15.8334 16.6668 10 16.6668C4.16671 16.6668 0.833374 10.0002 0.833374 10.0002Z"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 12.5002C11.3808 12.5002 12.5 11.3809 12.5 10.0002C12.5 8.61945 11.3808 7.50016 10 7.50016C8.61933 7.50016 7.50004 8.61945 7.50004 10.0002C7.50004 11.3809 8.61933 12.5002 10 12.5002Z"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 18 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 15.6667H16.5M12.75 1.91669C13.0815 1.58517 13.5312 1.39893 14 1.39893C14.2321 1.39893 14.462 1.44465 14.6765 1.53349C14.891 1.62233 15.0858 1.75254 15.25 1.91669C15.4142 2.08085 15.5444 2.27572 15.6332 2.4902C15.722 2.70467 15.7678 2.93455 15.7678 3.16669C15.7678 3.39884 15.722 3.62871 15.6332 3.84319C15.5444 4.05766 15.4142 4.25254 15.25 4.41669L4.83333 14.8334L1.5 15.6667L2.33333 12.3334L12.75 1.91669Z"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="hover:bg-gray-100 rounded-sm cursor-pointer">
                            <svg
                              width="34"
                              height="34"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.5 14.9998H14.1667M14.1667 14.9998H27.5M14.1667 14.9998V26.6665C14.1667 27.1085 14.3423 27.5325 14.6548 27.845C14.9674 28.1576 15.3913 28.3332 15.8333 28.3332H24.1667C24.6087 28.3332 25.0326 28.1576 25.3452 27.845C25.6577 27.5325 25.8333 27.1085 25.8333 26.6665V14.9998H14.1667ZM16.6667 14.9998V13.3332C16.6667 12.8911 16.8423 12.4672 17.1548 12.1547C17.4674 11.8421 17.8913 11.6665 18.3333 11.6665H21.6667C22.1087 11.6665 22.5326 11.8421 22.8452 12.1547C23.1577 12.4672 23.3333 12.8911 23.3333 13.3332V14.9998M18.3333 19.1665V24.1665M21.6667 19.1665V24.1665"
                                stroke="#667085"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <div
                          className={`px-2 py-1 text-[13px] rounded-full text-center font-medium  ${
                            doc.status === "Active"
                              ? "bg-[#ECFDF3] text-[#027A48]"
                              : "bg-[#F2F4F7] text-[#344054]"
                          }`}
                        >
                          {doc.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <button className="flex items-center gap-2 text-sm text-[#344054] px-3.5 py-2 border border-[#D0D5DD] rounded-lg hover:bg-gray-50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.8333 6.99984H1.16666M1.16666 6.99984L6.99999 12.8332M1.16666 6.99984L6.99999 1.1665"
                    stroke="#344054"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm
                    ${
                      page === 1
                        ? "bg-[#F9F5FF] text-[#6941C6] border-2 border-[#6941C6]"
                        : "text-[#667085] hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 text-sm text-[#344054] px-3.5 py-2 border border-[#D0D5DD] rounded-lg hover:bg-gray-50">
                Next
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.16663 6.99984H12.8333M12.8333 6.99984L6.99996 1.1665M12.8333 6.99984L6.99996 12.8332"
                    stroke="#344054"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
