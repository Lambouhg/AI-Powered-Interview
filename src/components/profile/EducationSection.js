/* eslint-disable @typescript-eslint/no-unused-vars */
// components/EducationSection.js
import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import EducationForm from "./EducationForm";
import { School } from "lucide-react";
const EducationSection = ({
  educations,
  setEducations,
  showEducationForm,
  setShowEducationForm,
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

  const addEducation = (newEdu) => {
    setEducations((prev) => [...prev, newEdu]);
    setShowEducationForm(false);
  };

  const editEducation = (index, updatedEducation) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = updatedEducation;
    setEducations(updatedEducations);
  };

  const deleteEducation = (index) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-t-2 border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Educations</h2>
        {isEditing && (
          <Plus
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => setShowEducationForm(true)}
          />
        )}
      </div>
      {educations.length > 0 ? (
        <div className="space-y-6">
          {educations.map((edu, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-900 flex items-center justify-center rounded">
                  <School className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{edu.school}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.degree}, {edu.fieldOfStudy}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(edu.startDate).split(",")[1]} -{" "}
                      {formatDate(edu.endDate).split(",")[1]}
                    </p>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Pencil
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                        onClick={() => {
                          // Open edit form or modal
                        }}
                      />
                      <Trash2
                        className="w-5 h-5 text-red-500 cursor-pointer"
                        onClick={() => deleteEducation(index)}
                      />
                    </div>
                  )}
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No educations added yet.</p>
      )}
      {showEducationForm && (
        <EducationForm
          addEducation={addEducation}
          setShowEducationForm={setShowEducationForm}
        />
      )}
    </div>
  );
};

export default EducationSection;
