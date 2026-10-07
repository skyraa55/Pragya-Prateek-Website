import { useEffect, useMemo, useState } from "react";
import { api, formatDate } from "../api.js";
import { Notice } from "./Fields.jsx";

const inr = (paise) => `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const BADGE = {
  paid: { text: "✅ Paid", cls: "bg-[#dff3e8] text-[#2d7a52]" },
  pending: { text: "⏳ Payment pending", cls: "bg-[#fff0d6] text-[#a8680c]" },
  link: { text: "🔗 Pay-link shared", cls: "bg-[#e8eefc] text-[#3b55a5]" },
  free: { text: "No fee", cls: "bg-[#eee] text-ink-soft" },
};

export default function BookingsManager({ onAuthError }) {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState(null);

  const load = () =>
    api.adminBookings().then(setItems).catch((e) => { if (!onAuthError(e)) setMsg({ type: "error", text: e.message }); });
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const paid = (items || []).filter((b) => b.status === "paid");
    return {
      total: items?.length || 0,
      paid: paid.length,
      pending: (items || []).filter((b) => b.status === "pending").length,
      revenue: paid.reduce((n, b) => n + b.amount, 0),
    };
  }, [items]);

  const shown = (items || []).filter((b) => filter === "all" || b.status === filter);

  const remove = async (b) => {
    if (!window.confirm(`Delete the booking from ${b.name}? This cannot be undone.`)) return;
    try {
      await api.deleteBooking(b.id);
      setMsg({ type: "ok", text: "Booking deleted." });
      await load();
    } catch (err) {
      if (!onAuthError(err)) setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div>
      <Notice msg={msg} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[["Bookings", stats.total], ["Paid", stats.paid], ["Awaiting payment", stats.pending], ["Collected", inr(stats.revenue)]].map(([k, v]) => (
          <div key={k} className="bg-white rounded-2xl p-4 shadow-soft-sm">
            <div className="text-[.78rem] text-ink-soft font-quicksand font-semibold">{k}</div>
            <div className="text-[1.5rem] font-bold font-quicksand">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[["all", "All"], ["paid", "Paid"], ["pending", "Awaiting payment"], ["free", "No fee"], ["link", "Pay-link"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`chip cursor-pointer border-0 !text-[.82rem] ${filter === id ? "!bg-ink !text-white" : ""}`}>{label}</button>
        ))}
      </div>

      {!items && <p className="text-ink-soft">Loading…</p>}
      {items && shown.length === 0 && <p className="text-ink-soft">No bookings here yet.</p>}

      <div className="flex flex-col gap-3">
        {shown.map((b) => {
          const badge = BADGE[b.status] || BADGE.free;
          return (
            <div key={b.id} className="bg-white rounded-2xl p-5 shadow-soft-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <b className="font-quicksand text-[1.05rem]">{b.name}</b>
                  <span className="text-[.8rem] text-ink-soft ml-2">{formatDate(b.createdAt)}</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-[.78rem] font-bold font-quicksand ${badge.cls}`}>
                  {badge.text}{b.amount ? ` · ${inr(b.amount)}` : ""}
                </span>
              </div>
              <p className="text-[.9rem] mt-1 font-quicksand font-semibold text-coral-deep">{b.topic}</p>
              <p className="text-[.88rem] text-ink-soft mt-1">
                <a className="underline" href={`mailto:${b.email}`}>{b.email}</a>
                {b.phone && <> · {b.phone}</>}
                {" · "}{b.mode || "—"}{b.date && <> · {b.date}</>}{b.time && <> · {b.time}</>}
              </p>
              {b.message && <p className="text-[.9rem] mt-2 whitespace-pre-wrap">{b.message}</p>}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[.78rem] text-ink-soft">
                <span>Ref: {b.id}{b.razorpayPaymentId && <> · Payment: {b.razorpayPaymentId}</>}{b.paidAt && <> · Paid {formatDate(b.paidAt)}</>}</span>
                <button className="font-quicksand font-bold cursor-pointer bg-transparent border-0 p-0 text-ink-soft" onClick={() => remove(b)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
