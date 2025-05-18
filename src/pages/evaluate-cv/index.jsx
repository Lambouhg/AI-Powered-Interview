"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import MainEvaluateCV from "../../components/EvaluateCV/MainEvaluateCV";

export default function EvaluateCVPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [cvUrl, setCvUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Khi router sẵn sàng → lấy query
  useEffect(() => {
    if (router.isReady) {
      const { cvUrl } = router.query;
      if (cvUrl) {
        setCvUrl(cvUrl);
      }
    }
  }, [router]);

  // Gọi API khi cvUrl và user đã có
  useEffect(() => {
    if (cvUrl && isLoaded) {
      handleEvaluate(cvUrl);
    }
  }, [cvUrl, isLoaded]);

  const handleEvaluate = async (url) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/evaluate-cv/evaluate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvUrl: url }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        // Lưu kết quả đánh giá tự động sau khi nhận được kết quả từ AI
        handleAutoSaveEvaluation(data);
      } else {
        toast.error("AI error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error calling API");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSaveEvaluation = async (evaluationData) => {
    if (!user) return;

    try {
      const res = await fetch("/api/evaluate-cv/save-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          cvUrl: cvUrl,
          score: evaluationData.score,
          feedback: evaluationData.feedback,
          suggestions: evaluationData.suggestions,
          highlights: evaluationData.highlights,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("CV evaluation saved automatically!");
      } else {
        toast.error("Error saving evaluation: " + data.message);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
      console.error("Error saving evaluation:", err);
    }
  };

  return (
    <MainEvaluateCV
      loading={loading}
      result={result}
      cvUrl={cvUrl}
    />
  );
}
