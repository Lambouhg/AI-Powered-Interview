// components/SkillsSection.js
import React from "react";
import { ArrowRight, Plus, X } from "lucide-react";

const SkillsSection = ({
  isEditing,
  skills,
  setSkills,
  showSkillForm,
  setShowSkillForm,
  newSkill,
  handleSkillChange,
  addSkill,
}) => {
  const handleEditClick = () => {
    setShowSkillForm(true);
  };

  const handleCancelClick = () => {
    setShowSkillForm(false);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="flex gap-2">
          {isEditing && (
            <Plus
              className="w-5 h-5 text-gray-400 cursor-pointer"
              onClick={handleEditClick}
            />
          )}
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-300"
            >
              <span>{skill}</span>
              {isEditing && (
                <X
                  className="ml-2 w-4 h-4 text-gray-500 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              )}
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-500">No skills added yet.</span>
        )}
      </div>
      {showSkillForm && (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newSkill}
              onChange={handleSkillChange}
              className="border rounded-md p-1 w-full"
              placeholder="Enter a new skill"
            />
            <button
              onClick={addSkill}
              className="w-1/6 py-2 text-black bg-blue-500 rounded-md hover:opacity-80"
            >
              Add Skill
            </button>
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
