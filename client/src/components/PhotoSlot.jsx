import { useState } from "react";

// Shows a real photo if the file exists in /public, otherwise the friendly placeholder.
// Hero photo: client/public/pragya.jpg      About photo: client/public/pragya-about.jpg
export default function PhotoSlot({ src, alt, hint, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <div className={`photo-slot !p-0 ${className}`}>
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className={`photo-slot ${className}`}>
      <div>
        <div className="text-[2rem] mb-1">📷</div>
        <small className="font-quicksand font-semibold text-[.8rem] leading-snug">{hint}</small>
      </div>
    </div>
  );
}
