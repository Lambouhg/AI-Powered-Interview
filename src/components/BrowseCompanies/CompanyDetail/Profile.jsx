//src/components/BrowseCompanies/CompanyDetail/Profile.jsx
import React from "react";

const Profile = ({ description }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
                Company Profile
            </h2>
            <p className="text-gray-700 leading-relaxed">
                {description || "No description provided"}
            </p>
        </div>
    );
};

export default Profile;