"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import ListCompaniesSearched from "../components/ListCompaniesSearched";
import logo from "../assets/logo.png";
import Image from "next/image";
export default function BrowseCompanies() {
  const router = useRouter();
  const toDashboard = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fff] text-black">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src={logo.src}
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full"
            />
            <span
              className="font-bold text-xl sm:text-3xl text-blue-500 cursor-pointer"
              onClick={toDashboard}
            >
              Job Finder
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center space-x-6">
            <span
              className="text-base sm:text-lg cursor-pointer text-black hover:text-blue-500 transition-colors"
              onClick={() => router.push("/FindJob")}
            >
              Find Jobs
            </span>
            <span
              className="text-base sm:text-lg cursor-pointer text-black hover:text-blue-500 transition-colors"
              onClick={() => router.push("/BrowseCompanies")}
            >
              Browse Companies
            </span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 sm:px-12 md:px-24 lg:px-32 py-12">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold pb-6 sm:pb-9 text-black leading-tight">
          <span className="pr-4">Find your</span>
          <span className="text-blue-500 border-b-2 border-blue-500">
            dream companies
          </span>
        </h1>
        <p className="text-gray-600 mb-8 text-base sm:text-lg md:text-xl">
          Discover the companies you’ve always dreamed of working for.
        </p>

        {/* Search Bar */}
        <ListCompaniesSearched />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
