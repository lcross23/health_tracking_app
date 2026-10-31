export default function NutritionTotals({ entries, goals = {} }) {
  const totals = entries.reduce(
    (result, entry) => ({
      calories: result.calories + Number(entry.calories || 0),
      protein: result.protein + Number(entry.protein || 0),
      carbs: result.carbs + Number(entry.carbs || 0),
      fat: result.fat + Number(entry.fat || 0),
      caffeine: result.caffeine + Number(entry.caffeine || 0),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      caffeine: 0,
    }
  );

  return (
    <div className="nutrition-totals">
      <NutritionItem
        label="Calories"
        value={totals.calories}
        goal={goals.calorie_goal}
        unit=""
      />

      <NutritionItem
        label="Protein"
        value={totals.protein}
        goal={goals.protein_goal}
        unit="g"
      />

      <NutritionItem
        label="Carbs"
        value={totals.carbs}
        goal={goals.carbs_goal}
        unit="g"
      />

      <NutritionItem
        label="Fat"
        value={totals.fat}
        goal={goals.fat_goal}
        unit="g"
      />

      <NutritionItem
        label="Caffeine"
        value={totals.caffeine}
        goal={goals.caffeine_goal}
        unit="mg"
      />
    </div>
  );
}

function NutritionItem({ label, value, goal, unit }) {
  const hasGoal = goal !== null && goal !== undefined;
  const progress = hasGoal
    ? Math.min((value / Number(goal)) * 100, 100)
    : 0;

  return (
    <div className="nutrition-item">
      <div className="nutrition-item-header">
        <span>{label}</span>
        <span>
          {Math.round(value)}
          {unit}

          {hasGoal && (
            <>
              {" "}
              / {goal}
              {unit}
            </>
          )}
        </span>
      </div>

      {hasGoal && (
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
