"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/company");
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Company List</h1>
      <div className="flex justify-end mb-4">
        <Link href="/company/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Create New Company
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company._id}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
            <p className="text-gray-700 mb-2">{company.description}</p>
            <p className="text-gray-500 text-sm">
              <strong>Location:</strong> {company.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
