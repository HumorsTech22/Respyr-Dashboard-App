"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { testHistory } from "../services/authService";

export default function TestHistoryTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const [rows, setRows] = useState([]);      
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Function to format date from "10/08/2025 14:53:08" to "10/Aug/2025 02:53:08 pm"
  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    
    try {
      // Parse the date string (assuming format: MM/DD/YYYY HH:mm:ss)
      const [datePart, timePart] = dateString.split(' ');
      const [month, day, year] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');
      
      // Create date object
      const date = new Date(year, month - 1, day, hours, minutes, seconds);
      
      // Format month as short name
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = monthNames[date.getMonth()];
      
      // Format time in 12-hour format
      let hours12 = date.getHours();
      const ampm = hours12 >= 12 ? 'pm' : 'am';
      hours12 = hours12 % 12;
      hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
      
      // Ensure two digits for minutes and seconds
      const minutesStr = minutes.toString().padStart(2, '0');
      const secondsStr = seconds.toString().padStart(2, '0');
      
      return `${day}/${monthName}/${year} ${hours12}:${minutesStr}:${secondsStr} ${ampm}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original if formatting fails
    }
  };

  // fetch on mount (same style as other APIs)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await testHistory();
        // resp.records -> map to your table fields
        const mapped =
          Array.isArray(resp?.records)
            ? resp.records.map((r) => ({
                subjectName: r?.subject_data?.name || r?.subject_data?.subject_id || "-",
                subjectId: r?.subject_data?.subject_id || "-",
                clinicId: r?.clinical_data?.login_id || "-", // Add clinic_id from login_id
                testDate: r?.clinical_data?.dttm || "-", // Get the dttm from clinical_data
                formattedTestDate: formatDate(r?.clinical_data?.dttm), // Format the date
                testTaken: r?.clinical_data?.record_count || "-", // showing as "Test Taken" column
                sugarScore: Number(r?.clinical_data?.Db_Score ?? 0),
                liverScore: Number(r?.clinical_data?.liver_score ?? 0),
                respiratoryScore: Number(r?.clinical_data?.Blow_Score ?? 0),
                gutScore: Number(r?.clinical_data?.Gut_Score_per ?? 0),
                avatar: "/assets/img/Group 2216.svg",
              }))
            : [];
        if (mounted) setRows(mapped);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load history");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.subjectName,
        r.subjectId,
        r.clinicId,
        r.testDate,
        r.formattedTestDate,
        r.testTaken,
        r.sugarScore,
        r.liverScore,
        r.respiratoryScore,
        r.gutScore,
      ]
        .map((v) => String(v).toLowerCase())
        .some((v) => v.includes(q))
    );
  }, [q, rows]);

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  const handleRowClick = (row) => {
    router.push(`/subjectprofile?subject_id=${row.subjectId}&clinic_id=${row.clinicId}`);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      {/* Items per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 pl-3">
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
          {loading
            ? "Loading…"
            : err
              ? <span className="text-red-500">{err}</span>
              : <>Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries{q && " (filtered)"} </>}
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
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : err ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-red-500">
                  {err}
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-400">
                  No results for <span className="font-medium">"{q}"</span>
                </td>
              </tr>
            ) : (
              currentItems.map((row, i) => (
                <tr
                  key={i}
                  className=" bg-white border-b last:border-0 border-gray-200 cursor-pointer"
                  onClick={() => handleRowClick(row)}
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold">{row.subjectName}</span>
                      <div className="flex flex-col text-xs text-gray-500 mt-1">
                        <span>ID: {row.subjectId}</span>
                        <span>Date: {row.formattedTestDate}</span>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4 text-[#535359]">{row.testTaken}</td>
                  <td className="px-6 py-4 text-[#535359]">{row.sugarScore}%</td>
                  <td className="px-6 py-4 text-[#535359]">{row.liverScore}%</td>
                  <td className="px-6 py-4 text-[#535359]">{row.respiratoryScore}%</td>
                  <td className="px-6 py-4 text-[#535359]">{row.gutScore}%</td>
                  <td className="px-6 py-4 text-[#535359]">
                    <Link
                      href={`/subjectprofile?subject_id=${row.subjectId}&clinic_id=${row.clinicId}`}
                      className="bg-[#3FAF58] text-white px-3 py-1 rounded hover:bg-[#3FAF58] transition-colors"
                      onClick={(e) => e.stopPropagation()} // Prevent row click event
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
      {(!loading && !err && totalPages > 1) && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex space-x-1 items-center gap-2">
            {currentPage === 1 ? (
              <MdOutlineKeyboardDoubleArrowLeft className="text-gray-400 w-[14px] h-[14px] cursor-not-allowed" />
            ) : (
              <MdOutlineKeyboardDoubleArrowLeft
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-black w-[14px] h-[14px] cursor-pointer hover:bg-gray-100 rounded"
              />
            )}

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded ${
                  currentPage === page ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {currentPage === totalPages ? (
              <MdOutlineKeyboardDoubleArrowRight className="text-gray-400 w-[14px] h-[14px] cursor-not-allowed" />
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