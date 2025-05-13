// pages/profile/[id].js
"use client";
import React, { useEffect, useState } from "react";
import SidebarUser from "../../components/SidebarCompany";
import HeaderCompany from "../../components/DashboardHeader";
import HeaderSection from "../../components/profile/HeaderSection";
import AboutSection from "../../components/profile/AboutSection";
import ExperienceSection from "../../components/profile/ExperienceSection";
import EducationSection from "../../components/profile/EducationSection";
import SkillsSection from "../../components/profile/SkillsSection";
import AdditionalDetailsSection from "../../components/profile/AdditionalDetailsSection";
import SocialLinksSection from "../../components/profile/SocialLinksSection";
import ShortVideoSection from "../../components/profile/ShortVideoSection";

import { useRouter } from "next/router";
import axios from "axios";
import { Loader } from "lucide-react";
import img1 from "../../assets/b79144e03dc4996ce319ff59118caf65.jpg";

const UserProfileView = () => {
  const router = useRouter();
  const { id } = router?.query;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(img1);
  const [name, setName] = useState("Have't data yet");
  const [location, setLocation] = useState("Have't data yet");
  const [aboutMe, setAboutMe] = useState("Have't data yet");
  const [email, setEmail] = useState("Have't data yet");
  const [phone, setPhone] = useState("Have't data yet");
  const [languages, setLanguages] = useState([]);
  const [instagram, setInstagram] = useState("Have't data yet");
  const [twitter, setTwitter] = useState("Have't data yet");
  const [website, setWebsite] = useState("Have't data yet");
  const [expereince, setExperiences] = useState([]);
  const [education, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [video, setVideo] = useState("");

  const isEditing = false;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(`/api/user?otherUserId=${id}`);
        const userData = res.data.user;

        setName(userData.name || "Have't data yet");
        setAvatar(userData.avatar || img1);
        setLocation(userData.location || "Have't data yet");
        setAboutMe(userData.aboutMe || "Have't data yet");
        setEmail(userData.email || "Have't data yet");
        setPhone(userData.phone || "Have't data yet");
        setLanguages(userData.Languages || []);
        setInstagram(userData.socialLinks?.instagram || "Have't data yet");
        setTwitter(userData.socialLinks?.twitter || "Have't data yet");
        setWebsite(userData.socialLinks?.facebook || "Have't data yet");
        setExperiences(userData.expereince || []);
        setEducations(userData.education || []);
        setSkills(userData.skills || []);
        setVideo(userData.video || "");

        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Không thể tải dữ liệu người dùng.");
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      fetchUserData();
    }
  }, [id, router.isReady]);

  if (isLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
        <Loader className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-gray-100">
      {/* Sidebar */}
      <SidebarUser />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <HeaderCompany dashboardHeaderName={"Profile"} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column (Profile & Main Content) */}
          <div className="md:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <HeaderSection
                name={name}
                avatar={avatar}
                aboutMe={aboutMe}
                location={location}
                isEditing={isEditing}
                email={email}
                phone={phone}
                languages={languages}
                instagram={instagram}
                twitter={twitter}
                website={website}
                expereince={expereince}
                education={education}
                skills={skills}
              />
            </div>

            {/* About Me */}
            <AboutSection isEditing={isEditing} aboutMe={aboutMe} />

            {/* Experience Section */}
            <ExperienceSection expereince={expereince} isEditing={isEditing} />

            {/* Education Section */}
            <EducationSection educations={education} isEditing={isEditing} />

            {/* Skills Section */}
            <SkillsSection isEditing={isEditing} skills={skills} />
          </div>

          {/* Right Column (Contact & Socials) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
              <AdditionalDetailsSection
                isEditing={isEditing}
                email={email}
                phone={phone}
                languages={languages}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Social Links</h2>
              <SocialLinksSection
                isEditing={isEditing}
                instagram={instagram}
                twitter={twitter}
                website={website}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Short Introduce</h2>
              <ShortVideoSection isEditing={isEditing} video={video} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
