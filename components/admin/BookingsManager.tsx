"use client";

import { useState, useMemo } from "react";
import { ClipboardList, ImageIcon, User, Check, Ban, CheckCircle2, UserCheck, ShieldAlert, ArrowUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Booking {
  id: number;
  type: string;
  service_name: string | null;
  category_name: string;
  price: number | null;
  customer_name: string;
  phone: string;
  address: string;
  area: string | null;
  pincode: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  images: string | null;
  created_at: string;
  status: string;
  assigned_worker: string | null;
  service_id: number | null;
  original_price: number | null;
  offer_code: string | null;
  discount_amount: number | null;
  final_amount: number | null;
}

interface BookingsManagerProps {
  initialBookings: Booking[];
}

export function BookingsManager({ initialBookings }: BookingsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [workerInputs, setWorkerInputs] = useState<Record<number, string>>({});

  // Unique areas in bookings
  const uniqueAreas = useMemo(() => {
    const list = new Set<string>();
    bookings.forEach((b) => {
      if (b.area) list.add(b.area);
    });
    return Array.from(list);
  }, [bookings]);

  // Apply filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (areaFilter !== "all" && b.area !== areaFilter) return false;
      if (dateFilter && b.preferred_date !== dateFilter) return false;
      return true;
    });
  }, [bookings, statusFilter, areaFilter, dateFilter]);

  const handleUpdateBooking = async (id: number, status: string, worker: string | null) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, assigned_worker: worker }),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status, assigned_worker: worker } : b))
      );
      alert(`Booking #${id} updated successfully to '${status}'.`);
    } catch (err) {
      console.error(err);
      alert("Failed to update booking.");
    }
  };

  const handleWorkerInputChange = (id: number, val: string) => {
    setWorkerInputs((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Service Bookings & Quotes</h1>
          <p className="text-muted text-sm mt-1 font-medium">
            Manage incoming instant booking schedules, assign field professionals, adjust statuses, and review quotation requests.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-border rounded-3xl p-5 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none bg-white font-medium focus:border-secondary"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending WhatsApp Log</option>
            <option value="accepted">Accepted / Confirmed</option>
            <option value="assigned">Worker Assigned</option>
            <option value="completed">Completed Successfully</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Area Location
          </label>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none bg-white font-medium focus:border-secondary"
          >
            <option value="all">All Surat Areas</option>
            {uniqueAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Target Date
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none font-medium focus:border-secondary"
          />
        </div>

        {(statusFilter !== "all" || areaFilter !== "all" || dateFilter) && (
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("all");
              setAreaFilter("all");
              setDateFilter("");
            }}
            className="h-10 text-xs font-bold"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            <ClipboardList className="h-12 w-12 mx-auto text-muted/30 mb-3" />
            No enquiries or bookings match your selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface text-xs font-semibold text-primary uppercase border-b border-border">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Service Required</th>
                  <th className="px-6 py-4">Status & Assignment</th>
                  <th className="px-6 py-4">Schedule Date</th>
                  <th className="px-6 py-4">Manage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredBookings.map((b) => {
                  let imageUrls: string[] = [];
                  if (b.images) {
                    try {
                      imageUrls = JSON.parse(b.images);
                    } catch {
                      // ignore
                    }
                  }

                  const workerInput = workerInputs[b.id] ?? b.assigned_worker ?? "";

                  return (
                    <tr key={b.id} className="hover:bg-surface/50">
                      <td className="px-6 py-4 font-mono text-xs text-muted">#{b.id}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary block text-base">{b.customer_name}</span>
                        <span className="block text-primary font-semibold text-xs mt-0.5">{b.phone}</span>
                        <span className="block text-xs text-muted max-w-[200px] break-words mt-1" title={b.address}>
                          {b.address} {b.area ? `(${b.area})` : ""} {b.pincode ? `- ${b.pincode}` : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary block">{b.service_name || "Custom Project Request"}</span>
                        <div className="flex gap-1.5 items-center mt-1">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            b.type === "instant" 
                              ? "bg-green-50 text-green-700 border border-green-150" 
                              : "bg-blue-50 text-blue-700 border border-blue-150"
                          }`}>
                            {b.type === "instant" ? "Instant" : "Quotation"}
                          </span>
                          <span className="text-xs text-muted">Cat: {b.category_name}</span>
                        </div>
                        {b.price && (
                          <div className="mt-1 text-xs">
                            {b.original_price ? (
                              <div className="space-y-0.5">
                                <div className="text-muted line-through text-[10px]">Original: ₹{b.original_price}</div>
                                {b.offer_code && (
                                  <div className="text-purple-700 font-extrabold text-[10px] uppercase">
                                    Coupon: {b.offer_code} (-₹{b.discount_amount})
                                  </div>
                                )}
                                <div className="font-bold text-[#20BD5A] text-sm">Payable: ₹{b.price}</div>
                              </div>
                            ) : (
                              <span className="font-bold text-[#20BD5A]">₹{b.price}</span>
                            )}
                          </div>
                        )}
                        {b.notes && (
                          <div className="mt-2 text-xs text-muted bg-surface p-2 rounded-xl max-w-[250px]">
                            <strong className="text-primary block mb-0.5">Notes:</strong>
                            <p className="whitespace-pre-wrap">{b.notes}</p>
                          </div>
                        )}
                        {imageUrls.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {imageUrls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative h-9 w-9 overflow-hidden rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:border-primary transition-colors hover:text-primary"
                                title="View uploaded image"
                              >
                                <ImageIcon className="h-4 w-4" />
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            b.status === "pending"
                              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                              : b.status === "accepted"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : b.status === "assigned"
                              ? "bg-purple-50 text-purple-800 border border-purple-200"
                              : b.status === "completed"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                          
                          {/* Worker Assignment */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <User className="h-3.5 w-3.5 text-muted shrink-0" />
                            {b.assigned_worker ? (
                              <span className="font-bold text-primary">Assigned: {b.assigned_worker}</span>
                            ) : (
                              <span className="text-muted italic">No professional assigned</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {b.type === "instant" ? (
                          <>
                            <span className="block text-primary font-bold text-sm">{b.preferred_date}</span>
                            <span className="block text-xs text-muted mt-0.5">{b.preferred_time}</span>
                          </>
                        ) : (
                          <span className="text-xs text-muted italic">Multi-day quote</span>
                        )}
                        <span className="block text-[10px] text-muted/65 mt-2">
                          Logged: {new Date(b.created_at).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-3.5 max-w-[200px]">
                          {/* Worker assignment form input */}
                          <div className="flex gap-1 items-center">
                            <input
                              type="text"
                              placeholder="Worker name"
                              value={workerInput}
                              onChange={(e) => handleWorkerInputChange(b.id, e.target.value)}
                              className="px-2 py-1 border border-border text-xs rounded outline-none w-28 focus:border-secondary"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateBooking(b.id, b.status === "pending" ? "assigned" : b.status, workerInput || null)}
                              className="px-2 py-1 text-[10px] bg-secondary text-primary font-bold rounded hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                            >
                              Assign
                            </button>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-1.5">
                            {b.status === "pending" && (
                              <button
                                onClick={() => handleUpdateBooking(b.id, "accepted", b.assigned_worker)}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 rounded hover:bg-blue-100 transition-colors whitespace-nowrap"
                              >
                                Accept Booking
                              </button>
                            )}
                            {b.status !== "completed" && b.status !== "cancelled" && (
                              <button
                                onClick={() => handleUpdateBooking(b.id, "completed", b.assigned_worker)}
                                className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold border border-green-200 rounded hover:bg-green-100 transition-colors whitespace-nowrap"
                              >
                                Complete Service
                              </button>
                            )}
                            {b.status !== "cancelled" && b.status !== "completed" && (
                              <button
                                onClick={() => handleUpdateBooking(b.id, "cancelled", b.assigned_worker)}
                                className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold border border-red-200 rounded hover:bg-red-100 transition-colors whitespace-nowrap"
                              >
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
