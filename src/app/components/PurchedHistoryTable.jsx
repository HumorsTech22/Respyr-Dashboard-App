


"use client";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClinicStats } from "../lib/store/slices/statsSlice";
import { FiBell } from "react-icons/fi";

export default function PurchasedHistoryNotifications() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((s) => s.stats);
  useEffect(() => {
    if (!data) dispatch(fetchClinicStats());
  }, [data, dispatch]);

  const records = useMemo(() => {
    const arr = data?.test_count_records ?? [];
    // newest first (higher timestamp first)
    return [...arr].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  }, [data?.test_count_records]);

  const totalRecords = data?.records_count ?? records.length;
  const remainingNow =
    (Number(data?.total_tests) || 0) - (Number(data?.test_used) || 0);

  const items = useMemo(
    () =>
      records.map((r, i) => {
        const added = Number(r?.test_count) || 0;
        const amount = Number(r?.amount) || 0;
        const afterPurchase = remainingNow + added;

        // Prefer UNIX timestamp for reliability
        const ts = Number(r?.timestamp);
        const dateObj = Number.isFinite(ts)
          ? new Date(ts * 1000)
          : r?.dttm
          ? new Date(r.dttm.replace(" ", "T"))
          : null;

        const when = dateObj
          ? dateObj.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-";

        return {
          id: r.id ?? `rec-${i}`,
          title: "Test Purchased",
          added, // test_count for this record
          amount,
          remainingNow,
          afterPurchase,
          when,
          dateTimeAttr: dateObj?.toISOString(),
        };
      }),
    [records, remainingNow]
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[#535359] font-medium">
            Notifications: <span className="font-semibold">{totalRecords}</span>
          </p>

          {/* Current Remaining pill */}
       <span className="text-xs rounded-full bg-green-50 border border-green-200 text-green-700 px-3 py-1">
  Remaining Now: <strong>{remainingNow}</strong> / {data?.total_tests}
</span>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {String(error)}
          </div>
        )}

        {/* Loading (skeleton) */}
        {loading && items.length === 0 && (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border bg-gray-50 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-3 w-1/3 bg-gray-200 mb-2 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 mb-1 rounded" />
                  <div className="h-3 w-1/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications list */}
        {!loading && items.length > 0 && (
          <ul className="space-y-3" role="list" aria-label="Notifications">
            {items.map((n) => (
              <li
                key={n.id}
                className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100">
                  <FiBell className="text-indigo-600" aria-hidden />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#252525]">
                    {n.added} {n.title}
                  </p>

                  <p className="text-sm font-semibold text-[#252525]">
                    Amount: <span className="text-[#7a7a7a]"> ₹{n.amount}</span>
                  </p>

                  <time
                    dateTime={n.dateTimeAttr}
                    className="mt-1 block text-xs text-[#7a7a7a]"
                    title={n.when}
                  >
                    {n.when}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center text-[#7a7a7a] py-6 border rounded-md bg-gray-50">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}
