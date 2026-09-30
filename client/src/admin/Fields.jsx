import { BG, COLOR_OPTIONS } from "../constants.js";

export function ColorPicker({ value, onChange }) {
  return (
    <div className="flex gap-2 mt-1">
      {COLOR_OPTIONS.map((c) => (
        <button key={c} type="button" onClick={() => onChange(c)} aria-label={c}
          className={`w-9 h-9 rounded-full border-[3px] cursor-pointer ${BG[c]} ${value === c ? "border-ink" : "border-white shadow-soft-sm"}`} />
      ))}
    </div>
  );
}

export function Notice({ msg }) {
  if (!msg) return null;
  return (
    <p className={`font-semibold mb-4 ${msg.type === "error" ? "text-coral-deep" : "text-[#3f8f68]"}`} role="status">
      {msg.text}
    </p>
  );
}
