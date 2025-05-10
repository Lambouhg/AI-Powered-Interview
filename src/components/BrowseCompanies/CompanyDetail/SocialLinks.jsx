//src/components/BrowseCompanies/CompanyDetail/SocialLinks.jsx
import React from "react";
import {
    FaFacebook,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";

const SocialLinks = ({ socialLinks }) => {
    const getSocialIcon = (platform) => {
        switch (platform) {
            case "facebook":
                return <FaFacebook className="text-xl" />;
            case "twitter":
                return <FaTwitter className="text-xl" />;
            case "linkedin":
                return <FaLinkedin className="text-xl" />;
            case "instagram":
                return <FaInstagram className="text-xl" />;
            case "youtube":
                return <FaYoutube className="text-xl" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
                Connect With Us
            </h2>
            {socialLinks && Object.entries(socialLinks).some(([, url]) => url) ? (
                <div className="flex flex-wrap gap-4">
                    {Object.entries(socialLinks).map(([platform, url]) => {
                        if (!url) return null;
                        return (
                            <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                            >
                                {getSocialIcon(platform)}
                                <span className="capitalize font-medium">{platform}</span>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-600">No social links provided</p>
            )}
        </div>
    );
};

export default SocialLinks;