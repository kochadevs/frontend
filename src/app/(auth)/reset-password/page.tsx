import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const ResetPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="md:w-[499px] w-full md:px-2 px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative h-[38px] w-[144.66px]">
            <Image
              alt="kocha_logo"
              src="/asset/kocha_logo.png"
              className="h-10 w-auto"
              fill
            />
          </div>
          <h2 className=" text-[30px] font-[700] tracking-tight text-[#2E3646]">
            Reset password
          </h2>
          <p className="text-[#667085] text-[14px]">
            Fill the form below and to reset your password. 
          </p>
        </div>

        <div className="mt-10">
          <div>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-[#344054]"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirm password"
                  className="block text-sm/6 font-medium text-[#344054]"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm password"
                    name="confirm password"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#334AFF] hover:text-white px-3 py-1.5 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer h-[40px]"
                >
                  Submit
                </Button>

                <Link href="/login">
                  {" "}
                  <Button
                    variant="ghost"
                    type="submit"
                    className="flex w-full justify-center rounded-md border hover:bg-gray-200 px-3 py-1.5 text-[16px] font-semiboldshadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 text-[#344054] cursor-pointer h-[40px]"
                  >
                    Back to log in
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
