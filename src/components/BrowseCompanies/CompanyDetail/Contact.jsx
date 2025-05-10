//src/components/BrowseCompanies/CompanyDetail/Contact.jsx
import React from "react";
import { FaEnvelope, FaPhone, FaMapMarked } from "react-icons/fa";

const Contact = ({ contact, location }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
                Contact Information
            </h2>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-600 w-6 h-6" />
                    <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="font-medium text-gray-800">
                            {contact?.email ? (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                >
                                    {contact.email}
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-600 w-6 h-6" />
                    <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p className="font-medium text-gray-800">
                            {contact?.phone ? (
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                >
                                    {contact.phone}
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FaMapMarked className="text-gray-600 w-6 h-6" />
                    <div>
                        <p className="text-gray-500 text-sm">Location</p>
                        <p className="font-medium text-gray-800">
                            {location ? (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        location
                                    )}`}
                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {location}
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;