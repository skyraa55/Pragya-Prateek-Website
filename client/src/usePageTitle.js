import { useEffect } from "react";

// Sets the browser tab title for a page.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Pragya Prateek` : "Pragya Prateek — Mental Health Educator & Psychology Content Creator";
  }, [title]);
}
