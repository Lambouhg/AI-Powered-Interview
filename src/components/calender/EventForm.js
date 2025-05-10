"use client";
import React, { useState } from "react";
import moment from "moment";

const EventForm = ({
  formValues,
  setFormValues,
  availableTimeSlots,
  applicants,
  onSubmit,
  onClose,
}) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleApplicantChange = (e) => {
    const applicant = applicants.find((app) => app._id === e.target.value);
    setSelectedApplicant(applicant || null);

    if (applicant) {
      setFormValues((prevValues) => ({
        ...prevValues,
        jobID: applicant.jobID || "",
        companyID: applicant.companyID || "",
        userID: applicant.userID || "",
        applicantID: applicant._id || "",
      }));
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Event</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formValues.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formValues.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              min={moment().format("YYYY-MM-DD")}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Time
            </label>
            <select
              id="time"
              name="time"
              value={formValues.time}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a time</option>
              {availableTimeSlots.map((slot) => (
                <option
                  key={slot.value}
                  value={slot.value}
                  disabled={slot.disabled}
                >
                  {slot.label} {slot.disabled ? "(Booked)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="applicant"
              className="block text-sm font-medium text-gray-700"
            >
              Select Applicant
            </label>
            <select
              id="applicant"
              name="applicant"
              onChange={handleApplicantChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select an applicant</option>
              {Array.isArray(applicants) &&
                applicants.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.fullName}
                  </option>
                ))}
            </select>
          </div>
          {selectedApplicant && (
            <div className="mb-4 flex space-x-2">
              <a
                href={selectedApplicant.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Check Resume
              </a>
              <a
                href={`/profile/${selectedApplicant.userID}`}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Check Profile
              </a>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
