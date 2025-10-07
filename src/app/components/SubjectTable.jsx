"use client";
import { useState, useEffect, useMemo } from "react";
import { subjectTable } from "../services/authService";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SubjectTable() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("access_token");
        if (!token) throw new Error("No access token found. Please login again.");

        const response = await subjectTable();
        if (response.success && response.data) {
          setSubjects(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch subjects");
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError(err.message || "Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return subjects;
    return subjects.filter((s) => {
      const id = String(s.subject_id ?? "").toLowerCase();
      const name = String(s.name ?? "").toLowerCase();
      const gender = String(s.gender ?? "").toLowerCase();
      const age = String(s.age ?? "");
      // match on id, name, gender, or age; extend if needed
      return (
        id.includes(q) ||
        name.includes(q) ||
        gender.includes(q) ||
        age.includes(q)
      );
    });
  }, [subjects, q]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading subjects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error: </strong> {error}
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        No subjects found.
      </div>
    );
  }

  return (
    <div>
      {/* Optional: show active filter */}
      {q && (
        <div className="text-sm text-gray-600 mb-3">
          Showing results for <span className="font-semibold">“{q}”</span>
        </div>
      )}

     {/* <div>
        <div className="flex border border-[#E1E6ED] bg-[#F5F7FA] rounded-[10px] py-[11px] pl-[15px]">
            <span className="text-[#252525] text-[12px] font-normal leading-[110%] tracking-[-0.24]">Type</span>
            <div></div>
            <span></span>
        </div>
      </div> */}

      <div className="relative overflow-x-auto pr-2.5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Subject ID</th>
              <th scope="col" className="px-6 py-3">Subject Name</th>
              <th scope="col" className="px-6 py-3">Gender</th>
              <th scope="col" className="px-6 py-3">Age</th>
              <th scope="col" className="px-6 py-3">Created on</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((subject, index) => (
              <tr
                key={subject.subject_id}
                className={`${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"} border-b dark:border-gray-700 border-gray-200`}
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {subject.subject_id}
                </th>
                <td className="px-6 py-4">{subject.name}</td>
                <td className="px-6 py-4 capitalize">{subject.gender}</td>
                <td className="px-6 py-4">{subject.age} years</td>
                <td className="px-6 py-4">{formatDate(subject.dttm)}</td>
                <td className="px-6 py-4">
                  <Link
                    href="/subjectprofile"
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    View All
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                  No matches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
