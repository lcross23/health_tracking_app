export default function FoodEntryList({ entries, onDelete }) {
  if (entries.length === 0) {
    return <p>No foods logged yet.</p>;
  }

  const groupedEntries = entries.reduce((groups, entry) => {
    const meal = entry.meal_type || "Other";

    if (!groups[meal]) {
      groups[meal] = [];
    }

    groups[meal].push(entry);
    return groups;
  }, {});

  return (
    <div className="food-entry-list">
      {Object.entries(groupedEntries).map(([meal, mealEntries]) => (
        <section key={meal} className="meal-section">
          <h3>{meal}</h3>

          {mealEntries.map((entry) => (
            <div key={entry.id} className="food-entry">
              <div>
                <strong>{entry.name}</strong>

                {entry.quantity && (
                  <span>
                    {" "}
                    - {entry.quantity} {entry.unit}
                  </span>
                )}

                <div className="food-entry-nutrition">
                  {entry.calories} calories · {entry.protein}g protein ·{" "}
                  {entry.carbs}g carbs · {entry.fat}g fat ·{" "}
                  {entry.caffeine}mg caffeine
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDelete(entry.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
