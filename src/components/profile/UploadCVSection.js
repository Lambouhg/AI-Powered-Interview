import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

export default function UploadCVSection({ initialUrl = "", onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(initialUrl);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);

  const { user } = useUser();
  const clerkId = user?.id;
  const router = useRouter();

  useEffect(() => {
    if (initialUrl) {
      setUploadedUrl(initialUrl);
      setFileName(initialUrl.split("/").pop());
    }
  }, [initialUrl]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !clerkId) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB!");
      return;
    }

    setUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("userId", clerkId); // Đúng tên trường backend yêu cầu

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/user/upload/upload-cv", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          setUploadedUrl(data.url);
          toast.success("Upload successful!");

          // Gọi callback nếu có
          if (typeof onUploadSuccess === "function") {
            onUploadSuccess(data.url);
          }
        } else {
          toast.error("Upload failed: " + data.error);
        }
      } else {
        toast.error("Server error during upload.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      toast.error("Network or server error.");
    };

    xhr.send(formData);
  };

  const handleEvaluate = async () => {
    if (!uploadedUrl) {
      toast.error("Please upload a CV first!");
      return;
    }
    router.push(`/evaluate-cv?cvUrl=${encodeURIComponent(uploadedUrl)}`);
  };

  return (
    <div className="space-y-6 mt-6">
      <div
        className="w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-blue-50 transition duration-300 ease-in-out transform hover:scale-105"
        style={{ backgroundColor: "#f0f4f8" }}
        onClick={() => document.getElementById("cv-input").click()}
      >
        <p className="text-gray-700 text-sm font-medium mb-4">
          {uploadedUrl ? `File: ${fileName}` : "Drag & Drop CV or Choose a File"}
        </p>
        <input
          id="cv-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-gray-500 text-xs mt-2">
          Only PDF files are allowed, max size 10MB
        </p>
      </div>

      {fileName && <p className="text-gray-600 text-sm mt-2">📂 {fileName}</p>}

      {uploading && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div
            className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {uploadedUrl && (
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => window.open(uploadedUrl, "_blank")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105"
          >
            View Uploaded CV
          </button>
          <button
            onClick={handleEvaluate}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105"
          >
            Evaluate CV with AI
          </button>
        </div>
      )}
    </div>
  );
}
