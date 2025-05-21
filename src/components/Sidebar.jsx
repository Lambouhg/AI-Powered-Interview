import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  FiMessageSquare,
  FiBriefcase,
  FiSearch,
  FiHome,
  FiSettings,
  FiLogOut,
  FiUser,
  FiGlobe,
} from "react-icons/fi";
import { Brain } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const returnToHome = () => {
    router.push("/");
  };
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  if (!user) {
    return <div>Redirecting...</div>; // Nếu user không tồn tại sau khi tải xong, sẽ điều hướng
  }
  if (!isLoaded) {
    return <div>Loading...</div>; // Chờ Clerk tải xong user
  }

  return (
    <div>
      {/* Nút mở menu trên Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar cho Desktop */}
      <aside className="hidden md:flex flex-col justify-between h-full w-80 bg-[#f0f2f5] rounded-xl shadow p-4">
        <div>
          <h2
            className="text-2xl font-bold text-blue-600 mb-6 cursor-pointer px-2 pt-2"
            onClick={returnToHome}
          >
            Job Finder
          </h2>
          <div className="flex items-center gap-3 px-2 mb-6">
            <img
              src={user?.imageUrl}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-blue-400 object-cover"
            />
            <div>
              <p className="font-semibold text-base text-gray-900">{user?.fullName || "Unknown User"}</p>
              <p className="text-xs text-green-500 font-medium">● Online</p>
            </div>
          </div>
          <nav className="space-y-2">
            <NavItem
              icon={<FiHome />}
              label="Dashboard"
              href="/users/dashboard"
              active={router.pathname === "/users/dashboard"}
            />
            <NavItem
              icon={<FiMessageSquare />}
              label="Messages"
              href="/messages/MessageCenter"
              active={router.pathname === "/messages/MessageCenter"}
            />
            <NavItem
              icon={<FiBriefcase />}
              label="My Applications"
              href="/UserMyApplication"
              active={router.pathname === "/UserMyApplication"}
            />
            <NavItem
              icon={<FiSearch />}
              label="Find Jobs"
              href="/JobFinderPage"
              active={router.pathname === "/JobFinderPage"}
            />
            <NavItem
              icon={<FiGlobe />}
              label="Browse Companies"
              href="/FindCompaniesPage"
              active={router.pathname === "/FindCompaniesPage"}
            />
            <NavItem
              icon={<FiUser />}
              label="My Public Profile"
              href="/users/UserProfile"
              active={router.pathname === "/users/UserProfile"}
            />
            <NavItem
              icon={<FiSettings />}
              label="Settings"
              href="/settings/Profile"
              active={router.pathname === "/settings/Profile"}
            />
            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Brain className="w-5 h-5" />
              <span
                className="text-sm sm:text-base cursor-pointer"
                onClick={() => router.push("/interview-practice/test")}
              >
                Interview Practice
              </span>
            </div>
          </nav>
        </div>
        <div className="space-y-4 border-t pt-4 mt-4">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              if (signOut) {
                signOut({ redirectUrl: "/" });
              }
            }}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-100 w-full justify-center"
          >
            <FiLogOut className="text-lg" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay cho Mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 ${
          !!isOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={toggleSidebar}
      >
        {/* Sidebar Mobile */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Ngăn không đóng khi nhấn vào sidebar
        >
          <div className="p-4">
            {/* Nút đóng menu */}
            <button className="absolute top-4 right-4" onClick={toggleSidebar}>
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Menu */}
            <nav className="mt-12 space-y-4">
              <NavItem
                icon={<FiHome />}
                label="Dashboard"
                href="/users/dashboard"
                active={router.pathname === "/users/dashboard"}
              />
              <NavItem
                icon={<FiMessageSquare />}
                label="Messages"
                href="/messages/MessageCenter"
                active={router.pathname === "/messages/MessageCenter"}
              />
              <NavItem
                icon={<FiBriefcase />}
                label="My Applications"
                href="/UserMyApplication"
                active={router.pathname === "/UserMyApplication"}
              />
              <NavItem
                icon={<FiSearch />}
                label="Find Jobs"
                href="/JobFinderPage"
                active={router.pathname === "/JobFinderPage"}
              />
              <NavItem
                icon={<FiGlobe />}
                label="Browse Companies"
                href="/FindCompaniesPage"
                active={router.pathname === "/FindCompaniesPage"}
              />
              <NavItem
                icon={<FiUser />}
                label="My Public Profile"
                href="/users/UserProfile"
                active={router.pathname === "/users/UserProfile"}
              />
              <NavItem
                icon={<FiSettings />}
                label="Settings"
                href="/settings/Profile"
                active={router.pathname === "/settings/Profile"}
              />
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Brain className="w-5 h-5" />
                <span
                  className="text-sm sm:text-base cursor-pointer"
                  onClick={() => router.push("/interview-practice/test")}
                >
                  Interview Practice
                </span>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

function NavItem({ icon, label, href, active }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300
        ${
          active
            ? "bg-blue-100 text-blue-600"
            : "text-gray-700 hover:bg-gray-200"
        }`}
    >
      <span className="text-lg">{icon || <FiHome />}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default Sidebar;
