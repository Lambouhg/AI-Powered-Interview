import React, { useState } from "react";
import { toast } from "react-hot-toast";

const EvaluateCV = ({ uploadedUrl }) => {
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [result, setResult] = useState(null); // Kết quả chấm điểm từ API
  const [error, setError] = useState(null); // Lỗi nếu có

  // Hàm gọi API chấm điểm CV
  const evaluateCV = async () => {
    if (!uploadedUrl) {
      toast.error("Chưa có CV để chấm điểm.");
      return;
    }

    setLoading(true); // Đang tải
    setError(null); // Reset lỗi
    setResult(null); // Reset kết quả trước khi gọi API

    try {
      const response = await fetch("/api/evaluate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvUrl: uploadedUrl }),  // Gửi URL của CV đã tải lên Supabase
      });

      const data = await response.json();

      if (data.success) {
        setResult(data); // Lưu kết quả vào state
        toast.success("Chấm điểm CV thành công!");
      } else {
        throw new Error(data.error || "Lỗi không xác định");
      }
    } catch (err) {
      setError(err.message); // Set lỗi nếu có
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false); // Dừng trạng thái tải
    }
  };

  return (
    <div className="evaluate-cv-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Chấm điểm CV bằng AI</h2>

      <button
        onClick={evaluateCV}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
      >
        {loading ? "Đang chấm điểm..." : "Chấm điểm CV"}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Kết quả chấm điểm:</h3>
          <p><strong>Điểm: </strong>{result.score}</p>
          <p><strong>Phản hồi: </strong>{result.feedback}</p>
          <div>
            <strong>Gợi ý cải thiện:</strong>
            <ul className="list-disc pl-5">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Điểm mạnh:</strong>
            <ul className="list-disc pl-5">
              {result.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          <p>Lỗi: {error}</p>
        </div>
      )}
    </div>
  );
};

export default EvaluateCV;
