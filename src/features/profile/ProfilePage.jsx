import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const initialProfile = {
  display_name: "",
  timezone: "UTC",
  calorie_goal: "",
  protein_goal: "",
  carbs_goal: "",
  fat_goal: "",
  caffeine_goal: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      setProfile(data || initialProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: saveError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: profile.display_name || null,
          timezone: profile.timezone || "UTC",
          calorie_goal: profile.calorie_goal
            ? Number(profile.calorie_goal)
            : null,
          protein_goal: profile.protein_goal
            ? Number(profile.protein_goal)
            : null,
          carbs_goal: profile.carbs_goal
            ? Number(profile.carbs_goal)
            : null,
          fat_goal: profile.fat_goal
            ? Number(profile.fat_goal)
            : null,
          caffeine_goal: profile.caffeine_goal
            ? Number(profile.caffeine_goal)
            : null,
          updated_at: new Date().toISOString(),
        });

      if (saveError) {
        throw saveError;
      }

      setMessage("Profile saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>

      {message && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Display name
          <input
            name="display_name"
            value={profile.display_name || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Timezone
          <input
            name="timezone"
            value={profile.timezone || ""}
            onChange={handleChange}
            placeholder="America/New_York"
          />
        </label>

        <label>
          Calorie goal
          <input
            type="number"
            name="calorie_goal"
            value={profile.calorie_goal || ""}
            onChange={handleChange}
            min="0"
          />
        </label>

        <label>
          Protein goal in grams
          <input
            type="number"
            name="protein_goal"
            value={profile.protein_goal || ""}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>

        <label>
          Carbohydrate goal in grams
          <input
            type="number"
            name="carbs_goal"
            value={profile.carbs_goal || ""}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>

        <label>
          Fat goal in grams
          <input
            type="number"
            name="fat_goal"
            value={profile.fat_goal || ""}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>

        <label>
          Caffeine goal in milligrams
          <input
            type="number"
            name="caffeine_goal"
            value={profile.caffeine_goal || ""}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
