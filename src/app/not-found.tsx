"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <Card className="overflow-hidden bg-transparent border-none shadow-none ">
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>

            {/* Error Code */}
            <div className="mb-4">
              <h1 className="text-8xl font-bold text-gray-900 mb-2">404</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-[#334AFF] to-[#6C47FF] mx-auto rounded-full"></div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Page Not Found
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
                The page might have been moved, deleted, or you entered an
                incorrect URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/" className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#334AFF] to-[#6C47FF] hover:from-[#251F99] hover:to-[#334AFF] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">
                Need help finding something?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-[#334AFF] hover:text-[#251F99] font-medium transition-colors duration-200"
              >
                <Search className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </div>
          </div>
        </Card>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#334AFF]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#6C47FF]/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
