"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MainEvaluateCV from "../../components/EvaluateCV/MainEvaluateCV";

export default function EvaluateCVPage() {
  const router = useRouter();
  const [cvUrl, setCvUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Khi router sẵn sàng → lấy query
  useEffect(() => {
    if (router.isReady) {
      const { cvUrl } = router.query;
      if (cvUrl) {
        setCvUrl(cvUrl);
      }
    }
  }, [router]);

  // Gọi API khi cvUrl đã có
  useEffect(() => {
    if (cvUrl) {
      handleEvaluate(cvUrl);
    }
  }, [cvUrl]);

  const handleEvaluate = async (url) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluate-cv/evaluate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvUrl: url }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        alert("Lỗi AI: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gọi API");
    } finally {
      setLoading(false);
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
