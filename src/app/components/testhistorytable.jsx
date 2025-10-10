"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

// dummy rows (swap with your API data later)
const ROWS = [
  {
    subjectName: `Apple MacBook Pro 17"`,
    testTaken: "Silver",
    sugarScore: 99,
    liverScore: 999,
    respiratoryScore: 199,
    gutScore: 1999,
    avatar: "/assets/img/Group 2216.svg",
  },
  {
    subjectName: "Microsoft Surface Pro",
    testTaken: "White",
    sugarScore: 120,
    liverScore: 850,
    respiratoryScore: 175,
    gutScore: 1600,
    avatar: "/assets/img/Group 2216.svg",
  },
  {
    subjectName: "Magic Mouse 2",
    testTaken: "Black",
    sugarScore: 88,
    liverScore: 720,
    respiratoryScore: 140,
    gutScore: 1200,
    avatar: "/assets/img/Group 2216.svg",
  },
  {
    subjectName: "Railway Mouse 2",
    testTaken: "green",
    sugarScore: 880,
    liverScore: 720,
    respiratoryScore: 140,
    gutScore: 1200,
    avatar: "/assets/img/Group 2216.svg",
  },
  {
    subjectName: "Respyr Mouse 2",
    testTaken: "Blue",
    sugarScore: 828,
    liverScore: 720,
    respiratoryScore: 140,
    gutScore: 1200,
    avatar: "/assets/img/Group 2216.svg",
  },
  {
    subjectName: "Zebster 2",
    testTaken: "Black",
    sugarScore: 188,
    liverScore: 1720,
    respiratoryScore: 140,
    gutScore: 1200,
    avatar: "/assets/img/Group 2216.svg",
  },
  {
    subjectName: "Reynolds 2",
    testTaken: "Yellow",
    sugarScore: 18,
    liverScore: 220,
    respiratoryScore: 140,
    gutScore: 1200,
    avatar: "/assets/img/Group 2216.svg",
  },
];

export default function TestHistoryTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = useMemo(() => {
    if (!q) return ROWS;
    return ROWS.filter((r) =>
      [
        r.subjectName,
        r.testTaken,
        r.sugarScore,
        r.liverScore,
        r.respiratoryScore,
        r.gutScore,
      ]
        .map((v) => String(v).toLowerCase())
        .some((v) => v.includes(q))
    );
  }, [q]);

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

  const handleRowClick = () => {
    router.push(`/subjectprofile`);
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

  return (
    <>
      {/* Items per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        
        {/* Pagination info */}
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          {q && " (filtered)"}
        </div>
      </div>

      <div className="relative overflow-x-auto pr-2.5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Subject Name</th>
              <th scope="col" className="px-6 py-3">Test Taken</th>
              <th scope="col" className="px-6 py-3">Sugar Score</th>
              <th scope="col" className="px-6 py-3">Liver Score</th>
              <th scope="col" className="px-6 py-3">Respiratory Score</th>
              <th scope="col" className="px-6 py-3">Gut Score</th>
              <th scope="col" className="px-6 py-3">View</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-400">
                  No results for <span className="font-medium">"{q}"</span>
                </td>
              </tr>
            ) : (
              currentItems.map((row, i) => (
                <tr
                  key={i}
                  className="bg-white border-b last:border-0 border-gray-200 cursor-pointer"
                  onClick={() => handleRowClick()}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {row.subjectName}
                  </th>
                  <td className="px-6 py-4">{row.testTaken}</td>
                  <td className="px-6 py-4">{row.sugarScore}</td>
                  <td className="px-6 py-4">{row.liverScore}</td>
                  <td className="px-6 py-4">{row.respiratoryScore}</td>
                  <td className="px-6 py-4">{row.gutScore}</td>
                  <td className="px-6 py-4">
                    <Link
                      href="/subjectprofile"
                      className="bg-[#3FAF58] text-white px-3 py-1 rounded hover:bg-[#3FAF58] transition-colors"
                    >
                      View All
                    </Link>
                  </td>
                </tr>
              ))
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
    </>
  );
}