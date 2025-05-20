"use client";

import React, { useEffect, useState } from "react";
import SidebarUser from "../../components/Sidebar";
import HeaderCompany from "../../components/DashboardHeader";
import HeaderSection from "../../components/profile/HeaderSection";
import AboutSection from "../../components/profile/AboutSection";
import ExperienceSection from "../../components/profile/ExperienceSection";
import EducationSection from "../../components/profile/EducationSection";
import SkillsSection from "../../components/profile/SkillsSection";
import AdditionalDetailsSection from "../../components/profile/AdditionalDetailsSection";
import SocialLinksSection from "../../components/profile/SocialLinksSection";
import axios from "axios";
import { Loader } from "lucide-react";
import img1 from "../../assets/b79144e03dc4996ce319ff59118caf65.jpg";
import ShortVideoSection from "../../components/profile/ShortVideoSection";
import UploadCVSection from "../../components/profile/UploadCVSection";
import { useRouter } from "next/router";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(img1);
  const [name, setName] = useState("Have't data yet");
  const [location, setLocation] = useState("Have't data yet");
  const [aboutMe, setAboutMe] = useState("Have't data yet");
  const [email, setEmail] = useState("Have't data yet");
  const [phone, setPhone] = useState("Have't data yet");
  const [Languages, setLanguages] = useState([]);
  const [instagram, setInstagram] = useState("Have't data yet");
  const [twitter, setTwitter] = useState("Have't data yet");
  const [expereince, setExperiences] = useState([]);
  const [education, setEducations] = useState([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [skills, setSkills] = useState([]);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [linkedin, setLinkedin] = useState("Have't data yet");
  const [youtube, setYoutube] = useState("Have't data yet");
  const [facebook, setFacebook] = useState("Have't data yet");
  const [video, setVideo] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/user");
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
        setFacebook(userData.socialLinks?.facebook || "Have't data yet");
        setLinkedin(userData.socialLinks?.linkedin || "Have't data yet");
        setYoutube(userData.socialLinks?.youtube || "Have't data yet");
        setExperiences(userData.expereince || []);
        setEducations(userData.education || []);
        setSkills(userData.skills || []);
        setVideo(userData.video || "");
        setCvUrl(userData.cvUrl || "");
      } catch (err) {
        setError("Không thể tải dữ liệu người dùng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleViewHistory = () => {
    // Navigate to the history page to view evaluation results
    router.push("/evaluate-cv/EvaluationHistory");
  };

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
      <SidebarUser isOpen={isOpen} setIsOpen={setIsOpen} />

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
                setName={setName}
                aboutMe={aboutMe}
                setAboutMe={setAboutMe}
                location={location}
                setLocation={setLocation}
                isEditing={false}
                setIsEditing={setIsEditing}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                Languages={Languages}
                setLanguages={setLanguages}
                instagram={instagram}
                setInstagram={setInstagram}
                twitter={twitter}
                setTwitter={setTwitter}
                expereince={expereince}
                education={education}
                skills={skills}
                video={video}
                setVideo={setVideo}
                linkedin={linkedin}
                setLinkedin={setLinkedin}
                youtube={youtube}
                setYoutube={setYoutube}
                facebook={facebook}
                setFacebook={setFacebook}
              />
            </div>

            {/* About Me */}
            <AboutSection isEditing={false} aboutMe={aboutMe} setAboutMe={setAboutMe} />

            {/* Experience Section */}
            <ExperienceSection
              expereince={expereince}
              setExperiences={setExperiences}
              showExperienceForm={false}
              setShowExperienceForm={() => {}}
              isEditing={false}
            />

            {/* Education Section */}
            <EducationSection
              educations={education}
              setEducations={setEducations}
              showEducationForm={false}
              setShowEducationForm={() => {}}
              isEditing={false}
            />

            {/* Skills Section */}
            <SkillsSection
              isEditing={false}
              skills={skills}
              setSkills={setSkills}
              showSkillForm={false}
              setShowSkillForm={() => {}}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              handleSkillChange={handleSkillChange}
              addSkill={() => {}}
            />
          </div>

          {/* Right Column (Contact & Socials) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
              <AdditionalDetailsSection
                isEditing={false}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                Languages={Languages}
                setLanguages={setLanguages}
                newLanguage={newLanguage}
                setNewLanguage={setNewLanguage}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Social Links</h2>
              <SocialLinksSection
                isEditing={false}
                instagram={instagram}
                setInstagram={setInstagram}
                twitter={twitter}
                setTwitter={setTwitter}
                facebook={facebook}
                setFacebook={setFacebook}
                linkedin={linkedin}
                setLinkedin={setLinkedin}
                youtube={youtube}
                setYoutube={setYoutube}
              />
            </div>

            {/* Add button to view evaluation history */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">View Evaluation History</h2>
              <button
                onClick={handleViewHistory} // Navigate to the history page
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105"
              >
                View Evaluation History
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Upload CV</h2>
              <UploadCVSection
                  initialUrl={cvUrl}
                  onUploadSuccess={(url) => setCvUrl(url)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
