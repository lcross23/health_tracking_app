import { useCallback, useEffect, useState } from "react";
import {
  getMeals,
  getMealItems,
  addMeal,
  deleteMeal,
  deleteMealItem,
  getFoods,
  addMealItem,
  createFood,
} from "../../services/log";

export default function useMeals({ dailyLogId, userId }) {
  const [meals, setMeals] = useState([]);
  const [mealItems, setMealItems] = useState([]);
  const [foods, setFoods] = useState([]);

  const [loadingMeals, setLoadingMeals] = useState(true);
  const [loading, setLoading] = useState(false);
  const [foodLoading, setFoodLoading] = useState(false);

  const [deletingMealId, setDeletingMealId] = useState(null);
  const [deletingMealItemId, setDeletingMealItemId] =
    useState(null);

  const [error, setError] = useState("");

  const [expandedMeals, setExpandedMeals] = useState({});

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [showNewFoodForm, setShowNewFoodForm] = useState(false);

  const [newFood, setNewFood] = useState({
    name: "",
    serving_size: "",
    serving_unit: "",
    calories: "",
    protein_grams: "",
    carbs_grams: "",
    fat_grams: "",
    caffeine: "",
  });

  const loadMeals = useCallback(async () => {
  if (!dailyLogId || !userId) {
    setMeals([]);
    setMealItems([]);
    setLoadingMeals(false);
    return;
  }

  try {
    setLoadingMeals(true);
    setError("");

    const existingMeals = await getMeals(
      dailyLogId,
      userId
    );

    const mealIds = existingMeals.map((meal) => meal.id);

    const existingMealItems =
      mealIds.length > 0
        ? await getMealItems(mealIds, userId)
        : [];

    setMeals(existingMeals);
    setMealItems(existingMealItems);
  } catch (err) {
    setError(err.message || "Unable to load meals.");
  } finally {
    setLoadingMeals(false);
  }
}, [dailyLogId, userId]);


  useEffect(() => {
  loadMeals();
}, [loadMeals]);

  useEffect(() => {
    async function loadFoods() {
      if (!userId) {
        setFoods([]);
        return;
      }

      try {
        const existingFoods = await getFoods(userId);
        setFoods(existingFoods);
      } catch (err) {
        setError(err.message || "Unable to load foods.");
      }
    }

    loadFoods();
  }, [userId]);

  function toggleMealExpanded(mealId) {
    setExpandedMeals((currentExpanded) => ({
      ...currentExpanded,
      [mealId]: !currentExpanded[mealId],
    }));
  }

  async function handleAddMeal(selectedValue) {
    if (!selectedValue) {
      setError("Please select a meal.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newMeal = await addMeal(
        dailyLogId,
        userId,
        selectedValue
      );

      setMeals((currentMeals) => [
        ...currentMeals,
        newMeal,
      ]);
      await loadMeals();
    } catch (err) {
      setError(err.message || "Unable to add meal.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMeal(mealId) {
    try {
      setDeletingMealId(mealId);
      setError("");

      await deleteMeal(mealId);

      setMeals((currentMeals) =>
        currentMeals.filter((meal) => meal.id !== mealId)
      );

      setMealItems((currentItems) =>
        currentItems.filter((item) => item.meal_id !== mealId)
      );
      await loadMeals();
    } catch (err) {
      setError(err.message || "Unable to delete meal.");
    } finally {
      setDeletingMealId(null);
    }
  }

  async function handleDeleteMealItem(itemId) {
    try {
      setDeletingMealItemId(itemId);
      setError("");

      await deleteMealItem(itemId);

      setMealItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
      await loadMeals();
    } catch (err) {
      setError(err.message || "Unable to delete food.");
    } finally {
      setDeletingMealItemId(null);
    }
  }

  function handleOpenFoodDialog(meal) {
    setSelectedMeal(meal);
    setSelectedFoodId("");
    setShowNewFoodForm(false);
    setError("");
  }

  function handleCloseFoodDialog() {
    if (foodLoading) return;

    setSelectedMeal(null);
    setSelectedFoodId("");
    setShowNewFoodForm(false);
  }

  async function handleAddExistingFood() {
    if (!selectedMeal || !selectedFoodId) {
      setError("Please select a food.");
      return;
    }

    try {
      setFoodLoading(true);
      setError("");

      const selectedFood = foods.find(
        (food) => String(food.id) === String(selectedFoodId)
      );

      if (!selectedFood) {
        throw new Error("The selected food could not be found.");
      }

      const newMealItem = await addMealItem(
        selectedMeal.id,
        userId,
        selectedFood
      );

      setMealItems((currentItems) => [
        ...currentItems,
        newMealItem,
      ]);

      handleCloseFoodDialog();
      await loadMeals();
    } catch (err) {
      setError(err.message || "Unable to add food.");
    } finally {
      setFoodLoading(false);
    }
  }

  return {
    meals,
    mealItems,
    foods,
    loadingMeals,
    loading,
    foodLoading,
    error,
    deletingMealId,
    deletingMealItemId,
    expandedMeals,
    selectedMeal,
    selectedFoodId,
    showNewFoodForm,
    newFood,

    setSelectedFoodId,
    setShowNewFoodForm,
    setNewFood,

    toggleMealExpanded,
    handleAddMeal,
    handleDeleteMeal,
    handleDeleteMealItem,
    handleOpenFoodDialog,
    handleCloseFoodDialog,
    handleAddExistingFood,
  };
}
