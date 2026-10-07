import { useEffect, useState } from "react";
import { api } from "./api.js";
import { SITE, WORKSHOPS } from "./siteConfig.js";

// Site settings the owner edits in Admin → Site settings (Instagram, LinkedIn, workshop text, payment links).
// Falls back to the defaults in siteConfig.js if the server has nothing saved / can't be reached.
let pending = null;
export const refreshSite = () => { pending = null; };

export function useSite() {
  const [s, setS] = useState({});
  useEffect(() => {
    let alive = true;
    if (!pending) pending = api.getSettings();
    pending.then((d) => alive && setS(d)).catch(() => { pending = null; });
    return () => { alive = false; };
  }, []);

  return {
    ...SITE,
    instagramHandle: s.instagramHandle || SITE.instagramHandle,
    instagramUrl: s.instagramUrl || SITE.instagramUrl,
    linkedinUrl: s.linkedinUrl || SITE.linkedinUrl,
    professionalGuidanceDocUrl: s.professionalGuidanceDocUrl || SITE.professionalGuidanceDocUrl,
    paymentsEnabled: !!s.paymentsEnabled,
    fees: { career: s.careerFee || "", workshop: s.workshopFee || "", growth: s.growthFee || "" },
    workshops: {
      photos: s.workshopPhotos?.length ? s.workshopPhotos : WORKSHOPS.photos,
      themes: s.workshopThemes || WORKSHOPS.themes,
      sampleDesign: s.workshopSampleDesign || WORKSHOPS.sampleDesign,
    },
  };
}
