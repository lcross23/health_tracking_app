import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getLocalDateString } from "../../lib/dates";
import { getOrCreateDailyLog } from "../../services/log";
import MealsNew from "./MealsNew";

function addDays(dateString, amount) {
  const [year, month, day] = dateString.split("-").map(Number);

  // Create the date in local time to avoid UTC timezone shifts.
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);

  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export default function LogPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() =>
    getLocalDateString()
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = getLocalDateString();

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        setLoading(true);
        setError("");
        setDailyLog(null);

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!currentUser) {
          if (!cancelled) {
            setError("You must be logged in to view your food log.");
          }

          return;
        }

        if (cancelled) return;

        setUser(currentUser);

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        if (cancelled) return;

        setProfile(profileData);

        const selectedDailyLog = await getOrCreateDailyLog(selectedDate);

        if (cancelled) return;

        setDailyLog(selectedDailyLog);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your food log.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  function goToPreviousDay() {
    setSelectedDate((date) => addDays(date, -1));
  }

  function goToNextDay() {
    setSelectedDate((date) => addDays(date, 1));
  }

  function goToToday() {
    setSelectedDate(today);
  }

  if (loading) {
    return <p>Loading your food log...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user || !dailyLog) {
    return <p>Unable to load your food log.</p>;
  }

  return (
    <div>
      <h1>Food Log</h1>

      <div className="log-date-controls">
        <button type="button" onClick={goToPreviousDay}>
          Previous day
        </button>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          aria-label="Select log date"
        />

        <button type="button" onClick={goToNextDay}>
          Next day
        </button>

        <button
          type="button"
          onClick={goToToday}
          disabled={selectedDate === today}
        >
          Today
        </button>
      </div>

      <p>{selectedDate}</p>

      <MealsNew
        key={dailyLog.id}
        userId={user.id}
        dailyLogId={dailyLog.id}
      />
    </div>
  );
}
