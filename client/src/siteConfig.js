// ─────────────────────────────────────────────────────────────
// DEFAULTS only. The owner now edits Instagram / LinkedIn / workshop text / payment links
// herself in  Admin → ⚙️ Site settings  (saved on the server). Values saved there win;
// the ones below are only the fallback if nothing has been saved yet.
// Leave a value as "" and that button/link is simply hidden.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: "Pragya Prateek",
  roles: "Mental Health Educator | Psychology Content Creator | Well-Being Workshop Designer",

  youtubeName: "The Art of Mindful Thinking",
  youtubeUrl: "https://youtube.com/@pragya_prateek_psychologist",

  instagramHandle: "", // e.g. "@yourhandle"  (client: "will put the account name asap")
  instagramUrl: "",    // e.g. "https://instagram.com/yourhandle"

  linkedinUrl: "",     // client has not sent it yet

  // "Explore Professional Guidance" — if the client shares a Google/PDF doc, paste its URL here
  // and the button opens that doc. Leave "" to use the built-in /professional-guidance page.
  professionalGuidanceDocUrl: "",
};

// Blog categories requested by the client (the admin can still type any new category).
export const BLOG_CATEGORIES = [
  { name: "Psychology Careers", icon: "🎓", color: "bg-coral", desc: "Career paths, education, skills, earning ideas and professional opportunities." },
  { name: "Parenting", icon: "🧸", color: "bg-sage", desc: "Understanding children, teenagers, communication and family dynamics." },
  { name: "Relationships", icon: "❤️", color: "bg-lav", desc: "Psychological perspectives on conversations, connection and relationship patterns." },
  { name: "Generational Issues", icon: "🌍", color: "bg-sun", desc: "Exploring how changing social environments and generational experiences influence the way we think and interact." },
  { name: "Everyday Psychology", icon: "💭", color: "bg-coral", desc: "The psychology behind behaviours, choices, emotions and moments we confront in daily life." },
];

// Workshop page content — client will send photos / theme text / sample design.
export const WORKSHOPS = {
  photos: [],   // e.g. ["/workshops/1.jpg", "/workshops/2.jpg"]  (put the images in client/public/workshops/)
  themes: "",   // paragraph explaining the workshop themes
  sampleDesign: "", // sample workshop design text
};
