import { NavLink, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AppLayout() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out error:", error);
    }
  }

  return (
    <div className="app-shell">
      <main className="page-content">
        <Outlet />
      </main>

      <button type="button" onClick={handleSignOut}>
        Log out
      </button>

      <nav className="bottom-tabs">
        <NavLink
          to="/log"
          className={({ isActive }) =>
            isActive ? "tab-link active" : "tab-link"
          }
        >
          Log
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "tab-link active" : "tab-link"
          }
        >
          History
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "tab-link active" : "tab-link"
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/lognew"
          className={({ isActive }) =>
            isActive ? "tab-link active" : "tab-link"
          }
        >
          Log New
        </NavLink>
      </nav>
    </div>
  );
}
