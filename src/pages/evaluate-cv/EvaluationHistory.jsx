import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function EvaluationHistory() {
  const { user } = useUser();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/evaluate-cv/get-evaluation?userId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setEvaluations(data.evaluations);
        } else {
          alert("No evaluations found.");
        }
      } catch (err) {
        console.error("Error fetching evaluations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Evaluation History</h1>
      {evaluations.length === 0 ? (
        <p>No evaluations available.</p>
      ) : (
        evaluations.map((evaluation, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold">Evaluation {index + 1}</h2>
            <p><strong>Score:</strong> {evaluation.score}</p>
            <p><strong>Feedback:</strong> {evaluation.feedback}</p>
            <div>
              <strong>Suggestions:</strong>
              <ul className="list-disc pl-5">
                {evaluation.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Highlights:</strong>
              <ul className="list-disc pl-5">
                {evaluation.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}