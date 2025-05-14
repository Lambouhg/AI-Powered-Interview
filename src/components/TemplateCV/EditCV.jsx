"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function EditCV({ selectedTemplate, onSaveCV }) {
  const { user } = useUser();
  const [cvData, setCvData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
    objective: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Lưu dữ liệu CV vào backend
    const response = await fetch("/api/user/save-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id, // Lấy ID người dùng từ Clerk
        cvData: cvData,  // Gửi dữ liệu CV
      }),
    });

    const data = await response.json();
    if (data.success) {
      toast.success("CV saved successfully!");
    } else {
      toast.error("Error saving CV: " + data.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Edit your CV - {selectedTemplate}</h2>

      <div>
        <label className="block">Name:</label>
        <input
          type="text"
          name="name"
          value={cvData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block">Email:</label>
        <input
          type="email"
          name="email"
          value={cvData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block">Phone:</label>
        <input
          type="text"
          name="phone"
          value={cvData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block">Skills:</label>
        <textarea
          name="skills"
          value={cvData.skills}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block">Experience:</label>
        <textarea
          name="experience"
          value={cvData.experience}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block">Education:</label>
        <textarea
          name="education"
          value={cvData.education}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block">Objective:</label>
        <textarea
          name="objective"
          value={cvData.objective}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg mt-4"
      >
        Save CV
      </button>
    </div>
  );
}
