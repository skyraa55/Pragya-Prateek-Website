import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Link2,
  Wallet,
  Trash2,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";
import { api, formatDate } from "../api.js";

const inr = (paise) => `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/* status badges: colours come from the site palette */
const BADGE = {
  paid: { text: "Paid", Icon: CheckCircle2, cls: "border-[#c8ecdb] bg-[#ecf9f3] text-[#1f9462]" },
  pending: { text: "Payment pending", Icon: Clock, cls: "border-[#ffe0b8] bg-[#fff6e6] text-[#c76a0c]" },
  link: { text: "Pay-link shared", Icon: Link2, cls: "border-[#cfe6fb] bg-[#eaf5ff] text-[#1f86d6]" },
  free: { text: "No fee", Icon: null, cls: "border-[#eadfd6] bg-[#fffaf5] text-[#4a5a7a]" },
};

const FILTERS = [
  ["all", "All"],
  ["paid", "Paid"],
  ["pending", "Awaiting payment"],
  ["free", "No fee"],
  ["link", "Pay-link"],
];

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
  const countOf = (id) => (items || []).filter((b) => id === "all" || b.status === id).length;

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

  const STAT_CARDS = [
    { label: "Bookings", value: stats.total, Icon: CalendarCheck, tint: "#fff1f3", color: "#e0344f" },
    { label: "Paid", value: stats.paid, Icon: CheckCircle2, tint: "#ecf9f3", color: "#1f9462" },
    { label: "Awaiting payment", value: stats.pending, Icon: Clock, tint: "#fff6e6", color: "#c76a0c" },
    { label: "Collected", value: inr(stats.revenue), Icon: Wallet, tint: "#f1edff", color: "#6a4fc7" },
  ];

  return (
    <div className="min-w-0">
      <h2 className="text-[1.25rem] font-bold leading-[1.3] sm:text-[1.4rem]">Bookings &amp; payments</h2>
      <p className="mt-1 text-[.9rem] leading-[1.6] text-[#4a5a7a]">
        Every session request, with its payment status.
      </p>

      {msg && (
        <p
          role={msg.type === "error" ? "alert" : "status"}
          className={`mt-4 rounded-xl border px-3.5 py-2.5 text-[.88rem] font-semibold ${
            msg.type === "error"
              ? "border-[#ffd3da] bg-[#fff1f3] text-[#c0324a]"
              : "border-[#c8ecdb] bg-[#ecf9f3] text-[#1f9462]"
          }`}
        >
          {msg.text}
        </p>
      )}

      {/* ---------- Stats ---------- */}
      <div className="mb-6 mt-5 grid grid-cols-2 gap-3 sm:mb-7 sm:gap-4 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, Icon, tint, color }) => (
          <div
            key={label}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#eadfd6] bg-[linear-gradient(180deg,#fff_0%,#fffaf5_100%)] p-3.5 sm:p-4"
          >
            <span
              aria-hidden="true"
              className="grid h-10 w-10 flex-none place-items-center rounded-xl sm:h-11 sm:w-11"
              style={{ backgroundColor: tint, color }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-[.74rem] font-semibold text-[#4a5a7a] sm:text-[.78rem]">{label}</div>
              <div className="truncate text-[1.15rem] font-bold leading-[1.2] sm:text-[1.4rem]">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Filters ---------- */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(([id, label]) => {
          const on = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`inline-flex flex-none cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[.82rem] font-bold transition duration-300 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none sm:text-[.85rem] ${
                on
                  ? "border-transparent bg-[#14274e] text-white shadow-[0_8px_20px_rgba(20,39,78,0.18)]"
                  : "border-[#eadfd6] bg-white text-[#14274e] hover:border-[#14274e]/40"
              }`}
            >
              {label}
              {items && (
                <span className={`text-[.75rem] font-semibold ${on ? "text-white/80" : "text-[#4a5a7a]"}`}>
                  {countOf(id)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!items && <p className="text-[.92rem] text-[#4a5a7a]">Loading…</p>}
      {items && shown.length === 0 && (
        <p className="rounded-xl border border-dashed border-[#eadfd6] bg-white px-4 py-8 text-center text-[.9rem] text-[#4a5a7a]">
          No bookings here yet.
        </p>
      )}

      {/* ---------- Booking cards ---------- */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {shown.map((b) => {
          const badge = BADGE[b.status] || BADGE.free;
          const BadgeIcon = badge.Icon;
          return (
            <div
              key={b.id}
              className="min-w-0 rounded-2xl border border-[#eadfd6] bg-white p-4 transition duration-300 hover:border-[#ff4d6d]/40 hover:shadow-[0_10px_26px_rgba(20,39,78,0.07)] motion-reduce:transition-none sm:p-5"
            >
              {/* header */}
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div className="min-w-0">
                  <b className="block break-words text-[1.02rem] leading-[1.3] sm:text-[1.08rem]">{b.name}</b>
                  <span className="mt-0.5 inline-flex items-center gap-1.5 text-[.78rem] text-[#4a5a7a]">
                    <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden="true" />
                    {formatDate(b.createdAt)}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[.76rem] font-bold ${badge.cls}`}
                >
                  {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" strokeWidth={2.1} aria-hidden="true" />}
                  {badge.text}
                  {b.amount ? ` · ${inr(b.amount)}` : ""}
                </span>
              </div>

              {/* topic */}
              {b.topic && (
                <p className="mt-3 break-words text-[.92rem] font-bold leading-[1.45] text-[#e0344f]">{b.topic}</p>
              )}

              {/* contact + session details */}
              <div className="mt-2 flex flex-col gap-1.5 text-[.86rem] leading-[1.5] text-[#4a5a7a] sm:flex-row sm:flex-wrap sm:gap-x-5">
                <a
                  href={`mailto:${b.email}`}
                  className="inline-flex min-w-0 items-center gap-1.5 break-all text-[#4a5a7a] underline decoration-[#eadfd6] underline-offset-4 transition-colors hover:text-[#ff4d6d]"
                >
                  <Mail className="h-3.5 w-3.5 flex-none" strokeWidth={1.9} aria-hidden="true" />
                  {b.email}
                </a>
                {b.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 flex-none" strokeWidth={1.9} aria-hidden="true" />
                    {b.phone}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[.84rem] text-[#4a5a7a]">
                {b.mode || "—"}
                {b.date && <> · {b.date}</>}
                {b.time && <> · {b.time}</>}
              </p>

              {/* message */}
              {b.message && (
                <p className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-[#eadfd6] bg-[#fffaf5] px-3.5 py-3 text-[.9rem] leading-[1.7] text-[#33425f]">
                  {b.message}
                </p>
              )}

              {/* footer */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-[#eadfd6] pt-3 text-[.76rem] text-[#4a5a7a]">
                <span className="min-w-0 break-all leading-[1.6]">
                  Ref: {b.id}
                  {b.razorpayPaymentId && <> · Payment: {b.razorpayPaymentId}</>}
                  {b.paidAt && <> · Paid {formatDate(b.paidAt)}</>}
                </span>
                <button
                  type="button"
                  onClick={() => remove(b)}
                  className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[.82rem] font-bold text-[#4a5a7a] transition-colors hover:text-[#c0324a]"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}