import React from "react";
import { ArrowRight, Mail, Phone, Globe, Plus, X } from "lucide-react"; // Thêm Plus và X từ lucide-react

const AdditionalDetailsSection = ({
  isEditing,
  email,
  setEmail,
  phone,
  setPhone,
  Languages,
  setLanguages,
  newLanguage,
  setNewLanguage,
}) => {
  const addLanguage = () => {
    if (newLanguage.trim() && !Languages.includes(newLanguage)) {
      setLanguages([...Languages, newLanguage]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (languageToRemove) => {
    setLanguages(
      Languages.filter((Languages) => Languages !== languageToRemove)
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Additional Details</h2>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400" />
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md p-1 text-gray-700"
              disabled={true}
            />
          ) : (
            <span className="text-sm text-gray-700">{email}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400" />
          {isEditing ? (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-md p-1"
            />
          ) : (
            <span className="text-sm text-gray-600">{phone}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-400" />
          <div className="w-full">
            {isEditing ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(Languages) && Languages.length > 0 ? (
                    Languages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-300"
                      >
                        <span>{language}</span>
                        <X
                          className="ml-2 w-4 h-4 text-gray-500 cursor-pointer"
                          onClick={() => removeLanguage(language)}
                        />
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No languages added yet.
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="border rounded-md p-1 w-full"
                    placeholder="Enter a new language"
                  />
                  <Plus
                    onClick={addLanguage}
                    className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-700"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Languages.length > 0 ? (
                  Languages.map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-300"
                    >
                      {language}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No languages added yet.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetailsSection;
