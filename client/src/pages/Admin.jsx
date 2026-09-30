import { useEffect, useState } from "react";
import { api, getToken, setToken } from "../api.js";
import BlogManager from "../admin/BlogManager.jsx";
import CourseManager from "../admin/CourseManager.jsx";

function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="max-w-[420px] mx-auto contact-card">
      <h1 className="text-[1.6rem] font-bold mb-1">Owner login</h1>
      <p className="text-ink-soft text-[.92rem]">Only the site owner can add or edit blogs and courses.</p>
      <form onSubmit={submit}>
        <label className="field-label" htmlFor="a-email">Email</label>
        <input className="field-input" id="a-email" type="email" required autoComplete="username"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="field-label" htmlFor="a-pass">Password</label>
        <input className="field-input" id="a-pass" type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-coral-deep font-semibold mt-3" role="alert">{error}</p>}
        <button className="btn btn-primary w-full justify-center mt-5 disabled:opacity-60" disabled={busy}>
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
    <section className="py-12 min-h-[75vh]">
      <div className="w-[92%] max-w-[1000px] mx-auto">
        {state === "checking" && <p className="text-center text-ink-soft">Checking…</p>}
        {state === "out" && <Login onLoggedIn={verify} />}
        {state === "in" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h1 className="text-[1.7rem] font-bold">Owner dashboard</h1>
              <button className="btn btn-line !px-4 !py-2 !text-[.85rem]" onClick={logout}>
                Log out
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              {[["blogs", "📝 Blog posts"], ["courses", "🎓 Courses"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`chip cursor-pointer border-0 !text-[.9rem] !px-5 !py-2 ${tab === id ? "!bg-ink !text-white" : ""}`}>
                  {label}
                </button>
              ))}
            </div>

            {tab === "blogs" ? (
              <BlogManager onAuthError={onAuthError} />
            ) : (
              <CourseManager onAuthError={onAuthError} />
            )}
          </>
        )}
      </div>
    </section>
  );
}
