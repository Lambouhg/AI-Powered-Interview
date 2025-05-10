"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";
import ListJobSearched from "../components/ListJobSearched";
import Image from "next/image";

export default function SearchJob() {
  const { user } = useUser();
  const router = useRouter();

  const toDashboard = () => {
    router.push("/");
  };

  const dashboard = () => {
    if (user) {
      router.push("users/dashboard");
    } else {
      document.querySelector("[data-clerk-sign-in-button]").click();
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] text-black">
      {/* Header */}
      <nav className="flex flex-col sm:flex-row justify-between items-center mb-12 ml-4 sm:ml-6 mr-4 sm:mr-5 mt-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <Image
              src={logo.src}
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full"
              priority
            />
            <span
              className="font-bold text-2xl sm:text-3xl text-blue-500"
              style={{ cursor: "pointer" }}
              onClick={toDashboard}
            >
              Job Finder
            </span>
          </div>
          <div className="flex space-x-4">
            <span
              className="text-sm sm:text-base pl-0 sm:pl-9 cursor-pointer text-black"
              onClick={() => router.push("/FindJob")}
            >
              Find Jobs
            </span>
            <span
              className="text-sm sm:text-base pl-0 sm:pl-2 cursor-pointer text-black"
              onClick={() => router.push("/BrowseCompanies")}
            >
              Browse Companies
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="bg-blue-600 px-4 py-2 rounded-lg text-sm sm:text-base"
                data-clerk-sign-in-button
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mb-5 ml-4 sm:ml-9 mr-4 sm:mr-5">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold pb-6 sm:pb-9 text-black">
          <span className="block sm:inline pr-0 sm:pr-4">Find your</span>
          <span className="text-blue-500 border-b-2 border-blue-500 height-full">
            dream jobs
          </span>
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-xl">
          Find your next career at companies like HubSpot, Nike, and Dropbox
        </p>

        {/* Search Bar */}
        <ListJobSearched />
      </div>
      <Footer />
    </div>
  );
}
