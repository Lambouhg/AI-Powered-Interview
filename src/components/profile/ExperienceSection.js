// components/ExperienceSection.js
import React from "react";
import { Plus, Twitter, Pencil, Trash2 } from "lucide-react";
import ExperienceForm from "./ExperienceForm";

const ExperienceSection = ({
  expereince,
  setExperiences,
  showExperienceForm,
  setShowExperienceForm,
  isEditing,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return `(${y > 0 ? `${y}y ` : ""}${m > 0 ? `${m}m` : ""})`;
  };

  const addExperience = (newExp) => {
    setExperiences((prev) => [...prev, newExp]);
    setShowExperienceForm(false);
  };

  const editExperience = (index, updatedExperience) => {
    const updatedExperiences = [...expereince];
    updatedExperiences[index] = updatedExperience;
    setExperiences(updatedExperiences);
  };

  const deleteExperience = (index) => {
    const updatedExperiences = expereince.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-t-2 border-gray-300 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Experiences</h2>
        {isEditing && (
          <Plus
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => setShowExperienceForm(true)}
          />
        )}
      </div>
      {expereince.length > 0 ? (
        <div className="space-y-6">
          {expereince.map((exp, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.company} · Full Time · {formatDate(exp.startDate)} -{" "}
                      {exp.endDate ? formatDate(exp.endDate) : "Present"}{" "}
                      {calculateDuration(exp.startDate, exp.endDate)}
                    </p>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Pencil
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                        onClick={() => {
                          editExperience(index, {
                            ...exp,
                            isEditing: true,
                          });
                        }}
                      />
                      <Trash2
                        className="w-5 h-5 text-red-500 cursor-pointer"
                        onClick={() => deleteExperience(index)}
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No experiences added yet.</p>
      )}
      {showExperienceForm && (
        <ExperienceForm
          addExperience={addExperience}
          setShowExperienceForm={setShowExperienceForm}
        />
      )}
    </div>
  );
};

export default ExperienceSection;
