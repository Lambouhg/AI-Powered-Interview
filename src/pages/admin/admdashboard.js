"use client";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import Header from "./Header";
import SearchAndFilter from "./SearchAndFilter";
import UserTable from "./UserTable";
import Pagination from "./Pagination";

export default function AdminDashboard() {
  const { signOut } = useClerk();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/callback/route", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (data.user && data.user.role === "admin") {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (hasAccess) {
      fetchUsers();
    }
  }, [hasAccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-lg">Bạn không có quyền truy cập vào trang này.</div>
      </div>
    );
  }

  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => roleFilter === 'all' || user.role === roleFilter);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch("/api/admin/updaterole", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error("Error updating role:", data.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <Header onSignOut={signOut} />

      <SearchAndFilter 
        roleFilter={roleFilter} 
        setRoleFilter={setRoleFilter} 
        usersPerPage={usersPerPage} 
        setUsersPerPage={setUsersPerPage} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />

      {currentUsers.length === 0 ? (
        <div className="text-gray-400">No users found</div>
      ) : (
        <UserTable users={currentUsers} onRoleChange={handleRoleChange} />
      )}

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
}