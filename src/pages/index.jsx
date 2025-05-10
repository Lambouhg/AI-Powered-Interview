"use client";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../components/Footer";
import img1 from "../assets/image.png"; // Verify this path
import logo from "../assets/logo.png"

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const DEFAULT_COMPANY_LOGO = "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
  useEffect(() => {
    if (user) {
      const saveUserToDatabase = async () => {
        try {
          const response = await fetch("/api/auth/callback/route", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.user.role === "admin") {
              router.push("/admin/admdashboard");
            } else {
              router.push("/");
            }
          }
        } catch (error) {
          console.error("Error saving user to database:", error);
        }
      };
      saveUserToDatabase();
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company/all");
        setCompanies(response.data.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/job/all");
        const jobs = response.data.jobs || response.data;
        setAllJobs(jobs);
        setFeaturedJobs(jobs.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredJobs = allJobs
        .filter((job) => job.status === "Live")
        .filter((job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4);
      setSearchResults(filteredJobs);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allJobs]);

  const dashboard = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userFromStorage = JSON.parse(savedUser);
      const role = userFromStorage.role;
      if (role === "user") {
        router.push("/users/dashboard");
      } else if (role === "company") {
        router.push("/company/companydashboard");
      }
    } else {
      document.querySelector("[data-clerk-sign-in-button]").click();
    }
  };

  const toUserSearch = () => {
    router.push("/FindJob");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery) {
      router.push(`/FindJob?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-[#F5F5F5FF] text-gray p-4 sm:p-6">
        {/* Navigation */}
        <nav className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 sm:space-x-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
            <div className="flex items-center space-x-2">
              <img
                src="logo"
                alt="Logo"
                className="rounded-full object-cover"
                width={50}
                height={50}
              />
              <span
                className="font-bold text-2xl text-blue-500 sm:text-3xl"
                onClick={() => router.push("/")}
              >
                Job Finder
              </span>
            </div>
            <div className="flex space-x-4">
              <span
                className="text-sm sm:text-base cursor-pointer"
                onClick={toUserSearch}
              >
                Find Jobs
              </span>
              <span
                className="text-sm sm:text-base cursor-pointer"
                onClick={() => router.push("/BrowseCompanies")}
              >
                Browse Companies
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className="text-sm sm:text-base cursor-pointer"
              onClick={dashboard}
            >
              Dashboard
            </span>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 text-white rounded-lg text-sm sm:text-base"
                  data-clerk-sign-in-button
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="mb-12 sm:mb-16 px-4 sm:px-9">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold pb-6 sm:pb-9">
            Discover more than
            <br />
            <span className="text-blue-500 border-b-2 border-blue-500">
              5000+ Jobs
            </span>
          </h1>
          <p className="mb-6 sm:mb-8 text-base sm:text-xl">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 relative">
            <input
              type="text"
              placeholder="Job title or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full sm:flex-1 bg-[#E4E4E4FF] p-3 sm:p-4 rounded-lg text-sm sm:text-base"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-[#FFFFFFFF] rounded-lg shadow-lg mt-2 z-10 max-h-96 overflow-y-auto">
                {searchResults.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 hover:bg-gray-800 hover:text-white cursor-pointer flex items-center gap-4"
                    onClick={() =>
                      router.push(`/FindJobDetail?jobId=${job._id}`)
                    }
                  >
                    <img
                      src={job.companyId?.logo || "/assets/image.png"}
                      alt={job.title}
                      className="rounded-lg object-cover"
                      width={40}
                      height={40}
                    />
                    <div>
                      <h3 className="text-sm font-semibold">{job.title}</h3>
                      <p className="text-xs">
                        {job.companyId?.name || "Unknown Company"} •{" "}
                        {job.location || "Unknown Location"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4 opacity-60">
            <span className="text-base sm:text-lg">
              Companies we helped grow:
            </span>
            <div className="flex flex-wrap items-center justify-between space-x-4 sm:space-x-8 cursor-pointer">
              {["Coinbase", "Intel", "Tesla", "AMD", "Talkit"].map(
                (company) => (
                  <span
                    key={company}
                    className="text-2xl sm:text-4xl font-mono font-semibold tracking-widest uppercase mb-2"
                  >
                    {company}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Explore by Company */}
        <div className="mb-12 sm:mb-16 px-4 sm:px-9">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
              Explore by company
            </h2>
            <button
              className="text-blue-500 text-sm sm:text-base"
              onClick={() => router.push("/BrowseCompanies")}
            >
              Show all companies
            </button>
          </div>
          {loading ? (
            <p className="text-gray-400">Đang tải...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {companies.map((company) => (
                <div
                  key={company._id}
                  className="bg-[#FFFFFFFF] p-4 sm:p-6 rounded-xl hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                  onClick={() => router.push(`/CompaniesDetail?companyId=${company._id}`)}
                >
                  {/* Add company logo */}
                  <div className="w-12 h-12 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={company.logo || DEFAULT_COMPANY_LOGO}
                      alt={company.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_COMPANY_LOGO;
                      }}
                    />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    {company.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {company.jobsCount ? `${company.jobsCount} Jobs` : "No Jobs"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Jobs */}
        <div className="mb-12 sm:mb-16 px-4 sm:px-9">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
              Featured jobs
            </h2>
            <button
              className="text-blue-500 text-sm sm:text-base"
              onClick={() => router.push("/FindJob")}
            >
              Show all jobs
            </button>
          </div>
          {loading ? (
            <p className="text-gray-400">Đang tải...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-4 sm:p-6 rounded-xl cursor-pointer hover:bg-gray-800 hover:text-white transition-all duration-300"
                  onClick={() => router.push(`/FindJobDetail?jobId=${job._id}`)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                    <img
                      src={job.companyId?.logo || DEFAULT_COMPANY_LOGO}
                      alt={job.title}
                      className="object-cover"
                      width={48}
                      height={48}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_COMPANY_LOGO;
                      }}
                    />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    {job.title}
                  </h3>
                  <p className="text-xs sm:text-sm mb-4">
                    {job.companyId?.name || "Unknown Company"} •{" "}
                    {job.location || "Unknown Location"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm bg-blue-600/20 px-2 sm:px-3 py-1 rounded-full">
                      {job.jobType || "Full Time"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}