import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const { data, error: historyError } = await supabase
        .from("daily_nutrition_totals")
        .select("*")
        .order("log_date", { ascending: false })
        .limit(30);

      if (historyError) {
        throw historyError;
      }

      setHistory(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading history...</p>;
  }

  return (
    <div>
      <h1>History</h1>

      {error && <p className="error-message">{error}</p>}

      {history.length === 0 ? (
        <p>No history available yet.</p>
      ) : (
        <div className="history-list">
          {history.map((day) => (
            <article key={day.daily_log_id}>
              <h2>{day.log_date}</h2>

              <p>Calories: {Math.round(day.calories)}</p>
              <p>Protein: {Math.round(day.protein)}g</p>
              <p>Carbs: {Math.round(day.carbs)}g</p>
              <p>Fat: {Math.round(day.fat)}g</p>
              <p>Caffeine: {Math.round(day.caffeine)}mg</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
