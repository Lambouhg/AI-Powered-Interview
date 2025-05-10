//src/components/FindJobs/JobSearchBar.jsx
import React from "react";

const JobSearchBar = ({
    searchQuery,
    setSearchQuery,
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="flex-1 bg-[#E9E9E9FF] p-4 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="text-md text-gray-500">
                Popular: UI Designer, UX Researcher, Android, Admin
            </div>
        </div>
    );
};

export default JobSearchBar;