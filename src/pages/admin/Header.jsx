"use client";
import { useClerk } from "@clerk/nextjs";
import { FiLogOut } from "react-icons/fi";

function Header() {
  const { signOut } = useClerk();

  return (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
      <button
       onClick={() => {
            localStorage.removeItem("user"); // Xóa dữ liệu người dùng khỏi localStorage
            signOut({ redirectUrl: "/" }); // Đăng xuất và chuyển hướng về trang chủ
          }}
        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-lg shadow-md"
      >
        <FiLogOut className="text-lg" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
}

export default Header;