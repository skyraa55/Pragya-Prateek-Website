import { useEffect, useState } from "react";
import { api } from "./api.js";

// One shared request so the Navbar and the Courses section don't both hit the server.
let pending = null;

export function useCourses() {
  const [state, setState] = useState({ courses: null, error: "" });
  useEffect(() => {
    let alive = true;
    if (!pending) pending = api.getCourses();
    pending
      .then((courses) => alive && setState({ courses, error: "" }))
      .catch((e) => {
        pending = null;
        alive && setState({ courses: null, error: e.message });
      });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
