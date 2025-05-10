"use client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import HeaderCompany from "../../components/HeaderCompany";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { BsPlusLg } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const initialMembers = [
  {
    name: "Célestin Gardinier",
    role: "CEO & Co-Founder",
    image: "/avatar1.jpg",
  },
  { name: "Reynaud Colbert", role: "Co-Founder", image: "/avatar2.jpg" },
  { name: "Arienne Lyon", role: "Managing Director", image: "/avatar3.jpg" },
  {
    name: "Bernard Alexander",
    role: "Managing Director",
    image: "/avatar4.jpg",
  },
  {
    name: "Christine Jhonson",
    role: "Managing Director",
    image: "/avatar5.jpg",
  },
  { name: "Aaron Morgan", role: "Managing Director", image: "/avatar6.jpg" },
];

const CompanyTeam = () => {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    image: "/default-avatar.jpg",
  });

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.role.trim()) {
      setMembers([...members, newMember]);
      setNewMember({ name: "", role: "", image: "/default-avatar.jpg" });
      setShowModal(false);
    }
  };

  const handleDeleteMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  return (
    <main className="mx-auto h-screen w-screen flex overflow-hidden">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full px-10 pt-5 h-full overflow-y-auto py-8">
        <HeaderCompany />

        {/* Tabs */}
        <div className="w-full mx-auto py-7">
          <header className="bg-white rounded-2xl shadow-sm mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              LIST TEAM MEMBERS
            </h1>
            <p className="text-gray-500">Manage your team members</p>

            <nav className="flex mt-6 space-x-1 bg-gray-100 p-1 rounded-xl">
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600"
                onClick={() => handleNavigation("/company/Settings")}
              >
                Overview
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600"
                onClick={() => handleNavigation("/company/SocialsLink")}
              >
                Social Links
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-white text-blue-600 shadow-sm">
                Team
              </button>
            </nav>
          </header>
        </div>

        <div className="mt-6 flex">
          {/* Sidebar Left */}
          <div className="w-1/4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <p className="text-gray-500">Add team members of your company</p>
          </div>

          {/* Main Content */}
          <div className="w-3/4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {members.length} Members
              </h2>
              <div className="flex space-x-3">
                <button
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowModal(true)}
                >
                  <BsPlusLg className="mr-2" /> Add Members
                </button>
                <button className="p-2 border rounded-md">
                  <FiGrid size={18} />
                </button>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center relative group transition-opacity duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover mb-4"
                  />
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                  <div className="flex justify-center space-x-2 mt-4">
                    <FaLinkedin
                      className="text-gray-500 hover:text-blue-600"
                      size={22}
                    />
                    <FaFacebook
                      className="text-gray-500 hover:text-blue-600"
                      size={22}
                    />
                  </div>

                  {/* Delete Button */}
                  <button
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteMember(index)}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Member</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded-md mb-3"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Role"
              className="w-full border p-2 rounded-md mb-3"
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAddMember}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CompanyTeam;
