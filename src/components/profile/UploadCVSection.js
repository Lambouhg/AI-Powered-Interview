"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function UploadCVSection({ initialUrl = "" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const { user } = useUser();
  const clerkId = user?.id;

  useEffect(() => {
    if (initialUrl) {
      setUploadedUrl(initialUrl);
      setFileName(initialUrl.split("/").pop());
    }
  }, [initialUrl]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !clerkId) return;

    if (file.type !== "application/pdf") {
      toast.error("Chỉ cho phép file PDF!");
      return;
    }

    setUploading(true);
    setProgress(0);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("userId", clerkId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/user/upload/upload-cv", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          setUploadedUrl(data.url);
          toast.success("Upload thành công!");
        } else {
          toast.error("Upload thất bại: " + data.error);
        }
      } else {
        toast.error("Lỗi server khi upload.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      toast.error("Lỗi mạng hoặc server không phản hồi.");
    };

    xhr.send(formData);
  };

  const handleEvaluate = () => {
    // Khi bấm vào nút "Chấm điểm CV", chuyển tới trang đánh giá
    window.location.href = `/evaluate-cv?cvUrl=${encodeURIComponent(uploadedUrl)}`;
  };

  return (
    <div className="space-y-6 mt-6">
      <label className="w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition">
        <p className="text-gray-700 text-sm font-medium">
          {uploadedUrl ? "📝 Thay CV khác" : "Tải CV (PDF)"}
        </p>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {fileName && <p className="text-gray-600 text-sm">📂 {fileName}</p>}

      {uploading && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {uploadedUrl && (
        <>
          <div className="flex space-x-4 mt-6">
            {/* Nút "Xem CV đã tải lên" */}
            <button
              onClick={() => window.open(uploadedUrl, "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              Xem CV đã tải lên
            </button>

            {/* Nút "Chấm điểm CV bằng AI" */}
            <button
              onClick={handleEvaluate}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              Chấm điểm CV bằng AI
            </button>
          </div>
        </>
      )}
    </div>
  );
}
