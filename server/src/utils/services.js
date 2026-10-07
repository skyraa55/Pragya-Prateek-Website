// The services the client offers — the single source of truth for booking topics.
// `key` links a booking to its fee / payment link stored in Site Settings.
export const SERVICES = [
  { key: "career", label: "1:1 Psychology Career Guidance Session" },
  { key: "workshop", label: "Workshop / Program Enquiry" },
  { key: "growth", label: "Professional Growth Guidance" },
  { key: "collab", label: "Collaboration / Project Call" },
];

export const serviceKeyFor = (topic = "") => SERVICES.find((s) => s.label === topic)?.key || null;
