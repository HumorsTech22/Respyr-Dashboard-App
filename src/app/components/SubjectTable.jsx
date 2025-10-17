"use client";
import { useState, useEffect, useMemo } from "react";
import { subjectTable } from "../services/authService";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function SubjectTable() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "dttm",
    direction: "desc" // default: newest first
  });
  
  const searchParams = useSearchParams();
  const router = useRouter();
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

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="inline ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" 
      ? <FaSortUp className="inline ml-1 text-blue-600" />
      : <FaSortDown className="inline ml-1 text-blue-600" />;
  };

  // Filter and sort subjects
  const filtered = useMemo(() => {
    let result = [...subjects];
    
    // Apply search filter
    if (q) {
      result = result.filter((s) => {
        const id = String(s.subject_id ?? "").toLowerCase();
        const name = String(s.name ?? "").toLowerCase();
        const gender = String(s.gender ?? "").toLowerCase();
        const age = String(s.age ?? "");
        return (
          id.includes(q) ||
          name.includes(q) ||
          gender.includes(q) ||
          age.includes(q)
        );
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date comparison
        if (sortConfig.key === "dttm") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        // Handle string comparison for other fields
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [subjects, q, sortConfig]);

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const handleRowClick = (subjectId, clinicId) => {
    router.push(`/subjectprofile?subject_id=${subjectId}&clinic_id=${clinicId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#308BF9"></div>
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
        <div className="text-md text-[#535359] mb-3">
          Showing results for <span className="font-semibold">"{q}"</span>
        </div>
      )}

      {/* Items per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-md text-[#535359]">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
              className="border border-[#535359] rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
            <span className="text-md text-[#535359]">entries</span>
        </div>
        
        {/* Pagination info */}
        <div className="text-md text-[#535359]">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          {q && " (filtered)"}
        </div>
      </div>

      <div className="relative overflow-x-auto pr-2.5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("subject_id")}
              >
                Subject ID {getSortIcon("subject_id")}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("name")}
              >
                Subject Name {getSortIcon("name")}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("gender")}
              >
                Gender {getSortIcon("gender")}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("age")}
              >
                Age {getSortIcon("age")}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort("dttm")}
              >
                Created on {getSortIcon("dttm")}
              </th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((subject, index) => (
              <tr
                key={subject.subject_id}
                className={`${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"} border-b dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
                onClick={() => handleRowClick(subject.subject_id, subject.clinic_id)}
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {subject.subject_id}
                </th>
                <td className="px-6 py-4">{subject.name}</td>
                <td className="px-6 py-4 capitalize">{subject.gender}</td>
                <td className="px-6 py-4">{subject.age} years</td>
                <td className="px-6 py-4">{formatDate(subject.dttm)}</td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/subjectprofile?subject_id=${subject.subject_id}&clinic_id=${subject.clinic_id}`}
                    className="bg-[#3FAF58] text-white px-3 py-1 rounded hover:bg-[#3FAF58] transition-colors"
                  >
                    View All
                  </Link> 
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                  No matches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex space-x-1 items-center gap-2">
            {/* Previous Page Arrow */}
            {currentPage === 1 ? (
              <MdOutlineKeyboardDoubleArrowLeft 
                className="text-gray-400 w-[14px] h-[14px] cursor-not-allowed"
              />
            ) : (
              <MdOutlineKeyboardDoubleArrowLeft 
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-black w-[14px] h-[14px] cursor-pointer hover:bg-gray-100 rounded"
              />
            )}

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Page Arrow */}
            {currentPage === totalPages ? (
              <MdOutlineKeyboardDoubleArrowRight 
                className="text-gray-400 w-[14px] h-[14px] cursor-not-allowed"
              />
            ) : (
              <MdOutlineKeyboardDoubleArrowRight 
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-black w-[14px] h-[14px] cursor-pointer hover:bg-gray-100 rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}