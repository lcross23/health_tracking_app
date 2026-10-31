import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getLocalDateString } from "../../lib/dates";
import {
  
  getOrCreateDailyLog,
  //getMeals,
  //deleteMeal,
} from "../../services/log";
//import FoodEntryForm from "../../components/FoodEntryForm";
//import FoodEntryList from "../../components/FoodEntryList";
//import NutritionTotals from "../../components/NutritionTotals";

import Meals from "./meals";

export default function LogPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);
  //const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  

  const currentDate = getLocalDateString();

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        // AuthGate should prevent this, but keep this check as a safeguard.
        if (!currentUser) {
          if (!cancelled) {
            setError("You must be logged in to view your food log.");
          }
          return;
        }

        if (cancelled) return;

        setUser(currentUser);

        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

        // PGRST116 means no profile row was found.
        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        if (cancelled) return;

        setProfile(profileData);

        const currentDailyLog = await getOrCreateDailyLog(currentDate);

        if (cancelled) return;

        setDailyLog(currentDailyLog);

        

        if (cancelled) return;

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
  }, [currentDate]);

  

  

  

  if (loading) {
    return <p>Loading your food log...</p>;
  }

  return (
    <div className="log-page">
      <header>
        <h1>Daily Log - {currentDate}</h1>
      </header>
      <Meals dailyLogId={dailyLog.id} userId={user.id}/>

      {error && <p className="error-message">{error}</p>}
      {/*
      <NutritionTotals
        entries={entries}
        goals={profile || {}}
      />

      <FoodEntryForm
        onSubmit={handleAddFood}
        loading={saving}
      />

      <FoodEntryList
        entries={entries}
        onDelete={handleDeleteFood}
      />*/}
    </div>
  );
}
