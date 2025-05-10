"use client";
import React, { useState } from "react";
import moment from "moment";

const EventModal = ({ event, onUpdate, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({ ...editedEvent, [name]: value });
  };

  const handleSave = () => {
    onUpdate(editedEvent);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {isEditing ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit event</h2>
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
                value={editedEvent.title}
                onChange={handleChange}
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
                value={editedEvent.description}
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
                value={editedEvent.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">{event.title}</h2>
            <p className="mb-2">
              <strong>Description:</strong> {event.description || "None"}
            </p>
            <p className="mb-2">
              <strong>Location:</strong> {event.location || "None"}
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {moment(event.start).format("DD/MM/YYYY")}
            </p>
            <p className="mb-2">
              <strong>Time:</strong> {moment(event.start).format("HH:mm")} -{" "}
              {moment(event.end).format("HH:mm")}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-indigo-500 text-white rounded"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
                onClick={onDelete}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
