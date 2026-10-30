import { useEffect, useState } from "react";
import { FileText, GraduationCap, CalendarCheck, Settings, LogOut, Eye, EyeOff } from "lucide-react";
import { api, getToken, setToken } from "../api.js";
import BlogManager from "../admin/BlogManager.jsx";
import CourseManager from "../admin/CourseManager.jsx";
import SettingsManager from "../admin/SettingsManager.jsx";
import BookingsManager from "../admin/BookingsManager.jsx";

/* Tabs: each one has its own accent colour from the site palette */
const TABS = [
  { id: "blogs", label: "Blog posts", Icon: FileText, color: "#ff4d6d" },
  { id: "courses", label: "Courses", Icon: GraduationCap, color: "#8b6fe0" },
  { id: "bookings", label: "Bookings & payments", Icon: CalendarCheck, color: "#2fb67c" },
  { id: "settings", label: "Site settings", Icon: Settings, color: "#ff9f43" },
];

const STYLES = `
  @keyframes adFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
`;

const INPUT =
  "w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-[.95rem] text-[#14274e] outline-none transition placeholder:text-[#4a5a7a]/60 focus:border-[#ff4d6d] focus:shadow-[0_0_0_4px_rgba(255,77,109,0.12)]";

function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="mb-7 text-center sm:mb-8">
        <span className="mb-3 inline-block rounded-full border border-[#ffd3da] bg-white px-3 py-1 text-[.75rem] font-bold text-[#ff4d6d] sm:px-4 sm:py-1.5 sm:text-[.85rem]">
          Admin
        </span>
        <h1 className="mb-2 text-[clamp(1.6rem,6vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.02em]">
          <span className="inline-block bg-[linear-gradient(100deg,#ff4d6d,#ff9f43,#8b6fe0,#ff4d6d)] bg-[length:300%_100%] bg-clip-text text-transparent animate-[adFlow_7s_ease-in-out_infinite] motion-reduce:animate-none">
            Owner
          </span>{" "}
          login
        </h1>
        <p className="mx-auto max-w-[36ch] text-[.92rem] leading-[1.7] text-[#4a5a7a] sm:text-[.97rem]">
          Only the site owner can add or edit blogs, courses and site settings.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-[20px] border border-[#eadfd6] bg-white p-5 shadow-[0_10px_30px_rgba(20,39,78,0.06)] sm:p-7"
      >
        <label className="mb-1.5 block text-[.85rem] font-bold" htmlFor="a-email">
          Email
        </label>
        <input
          className={INPUT}
          id="a-email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mb-1.5 mt-4 block text-[.85rem] font-bold" htmlFor="a-pass">
          Password
        </label>
        <div className="relative">
          <input
            className={`${INPUT} pr-12`}
            id="a-pass"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#4a5a7a] transition hover:text-[#14274e]"
          >
            {show ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.9} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={1.9} />}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-[#ffd3da] bg-[#fff1f3] px-3.5 py-2.5 text-[.88rem] font-semibold text-[#c0324a]"
          >
            {error}
          </p>
        )}

        <button
          disabled={busy}
          className="mt-6 w-full cursor-pointer rounded-full border-0 bg-[#14274e] px-6 py-3 text-[.95rem] font-bold text-white shadow-[0_8px_20px_rgba(20,39,78,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff4d6d] hover:shadow-[0_12px_26px_rgba(255,77,109,0.35)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#14274e] motion-reduce:transition-none"
        >
          {busy ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [state, setState] = useState("checking"); // checking | out | in
  const [tab, setTab] = useState("blogs");

  useEffect(() => {
    document.title = "Owner dashboard";
    // Keep this page out of search engines.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const verify = () => {
    if (!getToken()) return setState("out");
    api.me().then(() => setState("in")).catch(() => {
      setToken(null);
      setState("out");
    });
  };
  useEffect(verify, []);

  const logout = () => {
    setToken(null);
    setState("out");
  };

  // If a token expires mid-session, managers call this to send her back to the login form.
  const onAuthError = (err) => {
    if (err.status === 401) {
      logout();
      return true;
    }
    return false;
  };

  return (
    <section className="min-h-[75vh] overflow-x-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff3ec_100%)] py-10 text-[#14274e] sm:py-14 lg:py-16">
      <style>{STYLES}</style>

      <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-8">
        {state === "checking" && <p className="text-center text-[#4a5a7a]">Checking…</p>}
        {state === "out" && <Login onLoggedIn={verify} />}

        {state === "in" && (
          <>
            {/* ---------- Header ---------- */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
              <div>
                <span className="mb-2 inline-block rounded-full border border-[#ffd3da] bg-white px-3 py-1 text-[.72rem] font-bold text-[#ff4d6d] sm:text-[.8rem]">
                  Admin
                </span>
                <h1 className="text-[clamp(1.5rem,5vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                  Owner dashboard
                </h1>
              </div>

              <button
                onClick={logout}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#eadfd6] bg-white px-4 py-2 text-[.85rem] font-bold text-[#14274e] transition duration-300 hover:border-[#14274e] hover:bg-[#14274e] hover:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                Log out
              </button>
            </div>

            {/* ---------- Tabs ---------- */}
            <div
              role="tablist"
              className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:mb-8 sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map(({ id, label, Icon, color }) => {
                const on = tab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setTab(id)}
                    className={`inline-flex flex-none cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[.85rem] font-bold transition duration-300 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14274e] motion-reduce:transition-none sm:px-5 sm:text-[.9rem] ${
                      on
                        ? "border-transparent bg-[#14274e] text-white shadow-[0_8px_20px_rgba(20,39,78,0.18)]"
                        : "border-[#eadfd6] bg-white text-[#14274e] hover:border-[#14274e]/40"
                    }`}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.9}
                      aria-hidden="true"
                      style={{ color: on ? "#fff" : color }}
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ---------- Content ---------- */}
            <div className="min-w-0 rounded-[20px] border border-[#eadfd6] bg-white p-4 shadow-[0_10px_30px_rgba(20,39,78,0.06)] sm:p-6 lg:p-8">
              {tab === "blogs" && <BlogManager onAuthError={onAuthError} />}
              {tab === "courses" && <CourseManager onAuthError={onAuthError} />}
              {tab === "bookings" && <BookingsManager onAuthError={onAuthError} />}
              {tab === "settings" && <SettingsManager onAuthError={onAuthError} />}
            </div>
          </>
        )}
      </div>
    </section>
  );
}