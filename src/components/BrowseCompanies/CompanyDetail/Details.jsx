//src/components/BrowseCompanies/CompanyDetail/Details.jsx
import React from "react";

const Details = ({ industry, employees, dateFounded, location }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
                Company Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <p className="text-gray-500 text-sm">Industry</p>
                    <p className="font-medium text-gray-800">
                        {industry || "Not specified"}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Company Size</p>
                    <p className="font-medium text-gray-800">
                        {employees ? `${employees} employees` : "Not specified"}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Founded</p>
                    <p className="font-medium text-gray-800">
                        {dateFounded ? new Date(dateFounded).getFullYear() : "Not specified"}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Address</p>
                    <p className="font-medium text-gray-800">
                        {location || "Not specified"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Details;