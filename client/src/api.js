// All communication with the Node backend lives here.
const BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "pp_admin_token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (t) => {
  try {
    t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked — ignore */
  }
};

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Please check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // public
  getBlogs: () => request("/blogs"),
  getBlog: (slug) => request(`/blogs/${encodeURIComponent(slug)}`),
  getCourses: () => request("/courses"),
  sendBooking: (form) => request("/bookings", { method: "POST", body: form }),
  sendContact: (form) => request("/contact", { method: "POST", body: form }),

  // admin only (need the login token)
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/auth/me", { auth: true }),
  adminBlogs: () => request("/blogs/admin/all", { auth: true }),
  createBlog: (b) => request("/blogs", { method: "POST", body: b, auth: true }),
  updateBlog: (id, b) => request(`/blogs/${id}`, { method: "PUT", body: b, auth: true }),
  deleteBlog: (id) => request(`/blogs/${id}`, { method: "DELETE", auth: true }),
  createCourse: (c) => request("/courses", { method: "POST", body: c, auth: true }),
  updateCourse: (id, c) => request(`/courses/${id}`, { method: "PUT", body: c, auth: true }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: "DELETE", auth: true }),
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
