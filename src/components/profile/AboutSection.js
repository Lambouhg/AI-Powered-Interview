// components/AboutSection.js
import React from "react";
import { ArrowRight } from "lucide-react";

const AboutSection = ({ isEditing, aboutMe, setAboutMe }) => {
  return (
    <div className="bg-white p-6 pt-2 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">About Me</h2>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
      {isEditing ? (
        <textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          className="text-gray-600 text-sm border rounded-md p-1 w-full"
          rows="4"
        />
      ) : (
        <p className="text-gray-600 text-sm">{aboutMe}</p>
      )}
    </div>
  );
};

export default AboutSection;
