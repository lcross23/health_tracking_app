import { useState } from "react";

const initialForm = {
  name: "",
  mealType: "Breakfast",
  quantity: "",
  unit: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  caffeine: "",
  notes: "",
};

export default function FoodEntryForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    await onSubmit(form);
    setForm(initialForm);
  }

  return (
    <form onSubmit={handleSubmit} className="food-entry-form">
      <h2>Add food</h2>

      <label>
        Food name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Example: Chicken breast"
          required
        />
      </label>

      <label>
        Meal
        <select
          name="mealType"
          value={form.mealType}
          onChange={handleChange}
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
      </label>

      <div className="form-row">
        <label>
          Quantity
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>

        <label>
          Unit
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="grams"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Calories
          <input
            type="number"
            name="calories"
            value={form.calories}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>

        <label>
          Protein
          <input
            type="number"
            name="protein"
            value={form.protein}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Carbs
          <input
            type="number"
            name="carbs"
            value={form.carbs}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>

        <label>
          Fat
          <input
            type="number"
            name="fat"
            value={form.fat}
            onChange={handleChange}
            min="0"
            step="any"
          />
        </label>
      </div>

      <label>
        Caffeine
        <input
          type="number"
          name="caffeine"
          value={form.caffeine}
          onChange={handleChange}
          min="0"
          step="any"
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Optional notes"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add food"}
      </button>
    </form>
  );
}
