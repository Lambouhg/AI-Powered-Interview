"use client";
import { useState } from "react";
import ProfileForm from "../../components/ProfileForm";
import LoginDetails from "../../components/LoginDetails";
import Notifications from "../../components/Notifications";
import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../components/DashboardHeader";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("ProfileForm");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" w-screen h-screen overflow-hidden flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col border-b pb-2 border-l-2 gray-500 pl-5 h-full w-full overflow-y-auto">
        <div className="w-full mt-6 px-4 border-b-2 border-gray-200 mb-12">
          <DashboardHeader dashboardHeaderName={"Setting"} />
        </div>

        <div className="gap-x-4 flex mt-5">
          <button
            className={
              activeTab === "ProfileForm"
                ? "text-blue-600 border-b-2 border-blue-600 pb-2 font-semibold"
                : "text-gray-500"
            }
            onClick={() => setActiveTab("ProfileForm")}
          >
            My Profile
          </button>
          <button
            className={
              activeTab === "LoginDetails"
                ? "text-blue-600 border-b-2 border-blue-600 pb-2 font-semibold"
                : "text-gray-500"
            }
            onClick={() => setActiveTab("LoginDetails")}
          >
            Login Details
          </button>
          <button
            className={
              activeTab === "Notifications"
                ? "text-blue-600 border-b-2 border-blue-600 pb-2 font-semibold"
                : "text-gray-500"
            }
            onClick={() => setActiveTab("Notifications")}
          >
            Notifications
          </button>
        </div>
        <div className="mt-7">
          {activeTab === "ProfileForm" && <ProfileForm />}
          {activeTab === "LoginDetails" && <LoginDetails />}
          {activeTab === "Notifications" && <Notifications />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
