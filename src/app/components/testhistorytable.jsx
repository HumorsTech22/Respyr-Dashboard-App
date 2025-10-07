"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

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
];

export default function TestHistoryTable() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

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

  return (
<>
    {/* <div>
        <div className="flex border border-[#E1E6ED] bg-[#F5F7FA] rounded-[10px] py-[11px] pl-[15px]">
            <span className="text-[#252525] text-[12px] font-normal leading-[110%] tracking-[-0.24]">Type</span>
            <span></span>
        </div>
      </div> */}

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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-6 text-center text-gray-400">
                No results for <span className="font-medium">“{q}”</span>
              </td>
            </tr>
          ) : (
            filtered.map((row, i) => (
              <tr
                key={i}
                className="bg-white border-b last:border-0 border-gray-200"
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
                  <Link href="/patientprofile">
                    <button className="cursor-pointer">
                      <Image
                        src={row.avatar}
                        width={40}
                        height={40}
                        alt="User avatar"
                      />
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </>
  );
}
