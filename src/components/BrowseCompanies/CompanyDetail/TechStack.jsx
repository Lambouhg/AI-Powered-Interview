//src/components/BrowseCompanies/CompanyDetail/TechStack.jsx
import React from "react";

const TechStack = ({ techStack }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
                Tech Stack
            </h2>
            {techStack && techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No tech stack information</p>
            )}
        </div>
    );
};

export default TechStack;