import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Menu, X } from "lucide-react";
import {
  FiHome,
  FiMessageSquare,
  FiUsers,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const CompanySidebar = ({ isOpen, setIsOpen }) => {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const { user, isLoaded } = useUser(); // Kiểm tra isLoaded để tránh redirect sớm
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Chờ Clerk tải xong user
  }

  if (!user) {
    return <div>Redirecting...</div>; // Nếu user không tồn tại sau khi tải xong, sẽ điều hướng
  }

  return (
    <div>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <aside className="hidden md:flex flex-col justify-between h-full w-80 bg-[#f0f2f5] rounded-xl shadow p-4">
        <div>
          <h2
            className="text-2xl font-bold text-blue-600 mb-6 cursor-pointer px-2 pt-2"
            onClick={() => router.push("/")}
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
            <NavItem icon={<FiHome />} label="Dashboard" href="/company/companydashboard" />
            <NavItem icon={<FiMessageSquare />} label="Messages" href="/company/companymessage" />
            <NavItem icon={<FiUser />} label="Company Profile" href="/company/companyprofile" />
            <NavItem icon={<FiUsers />} label="All Applicants" href="/company/AllApplication" />
            <NavItem icon={<FiBriefcase />} label="Job Listings" href="/company/JobListingCompany" />
            <NavItem icon={<FiCalendar />} label="My Schedule" href="/company/Calender" />
            <NavItem icon={<FiSettings />} label="Settings" href="/company/Settings" />
          </nav>
        </div>
        <div className="space-y-4 border-t pt-4 mt-4">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              signOut({ redirectUrl: "/" });
            }}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-100 w-full justify-center"
          >
            <FiLogOut className="text-lg" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

function NavItem({ icon, label, href }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <div
      onClick={() => router.push(href)}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300
        ${
          isActive
            ? "bg-blue-100 text-blue-600"
            : "text-gray-700 hover:bg-gray-200"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default CompanySidebar;
