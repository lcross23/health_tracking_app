import { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";

import {
  addMeal,
  getMeals,
  deleteMeal,
  getFoods,
  createFood,
  addMealItem,
  getMealItems,
  deleteMealItem,
} from "../../services/log";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function Meals({ dailyLogId, userId }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [error, setError] = useState("");
  const [deletingMealId, setDeletingMealId] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [showNewFoodForm, setShowNewFoodForm] = useState(false);
  const [foodLoading, setFoodLoading] = useState(false);
  const [mealItems, setMealItems] = useState([]);
  const [expandedMeals, setExpandedMeals] = useState({});
  const [deletingMealItemId, setDeletingMealItemId] = useState(null);
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

  const options = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Snack", label: "Snack" },
    { value: "Pre-workout", label: "Pre-workout" },
    { value: "Post-workout", label: "Post-workout" },
    { value: "Other", label: "Other" },
  ];

  function toggleMealExpanded(mealId) {
  setExpandedMeals((currentExpanded) => ({
    ...currentExpanded,
    [mealId]: !currentExpanded[mealId],
  }));
}

  useEffect(() => {
    let cancelled = false;

    async function loadMeals() {
      if (!dailyLogId || !userId) {
        setMeals([]);
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
const existingMealItems = await getMealItems(
  mealIds,
  userId
);

if (!cancelled) {
  setMeals(existingMeals);
  setMealItems(existingMealItems);
}
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load meals.");
        }
      } finally {
        if (!cancelled) {
          setLoadingMeals(false);
        }
      }
    }

    loadMeals();

    return () => {
      cancelled = true;
    };
  }, [dailyLogId, userId]);
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

  function handleChange(event) {
    setSelectedValue(event.target.value);
  }

  async function handleAddMeal() {
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

      setSelectedValue("");
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
  } catch (err) {
    setError(err.message || "Unable to delete meal.");
  } finally {
    setDeletingMealId(null);
  }
}
function handleOpenFoodDialog(meal) {
  setSelectedMeal(meal);
  setSelectedFoodId("");
  setShowNewFoodForm(false);
  setNewFood({
    name: "",
    serving_size: "",
    serving_unit: "",
    calories: "",
    protein_grams: "",
    carbs_grams: "",
    fat_grams: "",
    caffeine: "",
  });
  setError("");
}

function handleCloseFoodDialog() {
  if (foodLoading) {
    return;
  }

  setSelectedMeal(null);
  setSelectedFoodId("");
  setShowNewFoodForm(false);
}

function handleFoodInputChange(event) {
  const { name, value } = event.target;

  setNewFood((currentFood) => ({
    ...currentFood,
    [name]: value,
  }));
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

    //await addMealItem(selectedMeal.id, userId,selectedFood);

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
  } catch (err) {
    setError(err.message || "Unable to add food to meal.");
  } finally {
    setFoodLoading(false);
  }
}

async function handleCreateAndAddFood() {
  if (!selectedMeal) {
    return;
  }

  const requiredFields = [
  "name",
  "serving_size",
  "serving_unit",
  "calories",
  "protein_grams",
  "carbs_grams",
  "fat_grams",
];

  const missingField = requiredFields.some(
    (field) => !String(newFood[field]).trim()
  );

  if (missingField) {
    setError("Please complete all required food fields.");
    return;
  }

  try {
    setFoodLoading(true);
    setError("");

    const createdFood = await createFood(userId, newFood);

    // Store the food values in meal_items
    const newMealItem = await addMealItem(
  selectedMeal.id,
  userId,
  createdFood
);

    setFoods((currentFoods) =>
      [...currentFoods, createdFood].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );

    

setMealItems((currentItems) => [
  ...currentItems,
  newMealItem,
]);

handleCloseFoodDialog();
  } catch (err) {
    setError(err.message || "Unable to create and add food.");
  } finally {
    setFoodLoading(false);
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
  } catch (err) {
    setError(err.message || "Unable to delete food from meal.");
  } finally {
    setDeletingMealItemId(null);
  }
}
const totalCalories = meals.reduce(
  (total, meal) => total + Number(meal.calories_total || 0),
  0
);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Meals
      </Typography>
      <Typography sx={{ mb: 2 }}>
  Total calories: {totalCalories} kcal
</Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="meal-type-label">
            Meal
          </InputLabel>

          <Select
            labelId="meal-type-label"
            id="meal-type"
            value={selectedValue}
            label="Meal"
            onChange={handleChange}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleAddMeal}
          disabled={loading || !selectedValue}
        >
          {loading ? "Adding..." : "Add Meal"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loadingMeals ? (
        <Typography>Loading meals...</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Meal</TableCell>
              <TableCell>Created</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
  {meals.map((meal) => {
    const mealLabel =
      options.find(
        (option) => option.value === meal.meal_type
      )?.label || meal.meal_type;

    const itemsForMeal = mealItems.filter(
      (item) => item.meal_id === meal.id
    );

    const isExpanded = Boolean(expandedMeals[meal.id]);

    return (
      <Fragment key={meal.id}>
        <TableRow>
          <TableCell>
            <IconButton
              size="small"
              onClick={() => toggleMealExpanded(meal.id)}
              aria-label={
                isExpanded
                  ? "Collapse meal items"
                  : "Expand meal items"
              }
            >
              {isExpanded ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>

            {mealLabel}
          </TableCell>
          <TableCell>
  {meal.calories_total || 0}
</TableCell>
<TableCell>
  {meal.protein_total || 0}
</TableCell>

          <TableCell>
            {meal.created_at
              ? new Date(
                  meal.created_at
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : ""}
          </TableCell>

          <TableCell>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteMeal(meal.id)}
              disabled={deletingMealId === meal.id}
            >
              {deletingMealId === meal.id
                ? "Deleting..."
                : "Meal"}
            </Button>
          </TableCell>

          <TableCell>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenFoodDialog(meal)}
            >
              Food
            </Button>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            colSpan={4}
            sx={{
              paddingBottom: 0,
              paddingTop: 0,
              borderBottom: isExpanded ? undefined : "none",
            }}
          >
            <Collapse
              in={isExpanded}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ margin: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Foods
                </Typography>

                {itemsForMeal.length === 0 ? (
                  <Typography color="text.secondary">
                    No food added to this meal.
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Food</TableCell>
                        <TableCell>Serving</TableCell>
                        <TableCell>Calories</TableCell>
                        <TableCell>Protein</TableCell>
                        <TableCell>Carbs</TableCell>
                        <TableCell>Fat</TableCell>
                        <TableCell>Caffeine</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {itemsForMeal.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>

                          <TableCell>
                            {item.serving_size}{" "}
                            {item.serving_unit}
                          </TableCell>

                          <TableCell>
                            {item.calories}
                          </TableCell>

                          <TableCell>
                            {item.protein_grams} g
                          </TableCell>

                          <TableCell>
                            {item.carbs_grams} g
                          </TableCell>

                          <TableCell>
                            {item.fat_grams} g
                          </TableCell>

                          <TableCell>
                            {item.caffeine || 0}
                          </TableCell>
                          <TableCell>
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteMealItem(item.id)}
          disabled={deletingMealItemId === item.id}
        >
          {deletingMealItemId === item.id
            ? "Deleting..."
            : "Delete"}
        </Button>
      </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  })}

  {meals.length === 0 && (
    <TableRow>
      <TableCell colSpan={4}>
        No meals added yet.
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      )}
      <Dialog
  open={Boolean(selectedMeal)}
  onClose={handleCloseFoodDialog}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>
    Add Food to {selectedMeal?.meal_type}
  </DialogTitle>

  <DialogContent>
    {!showNewFoodForm ? (
      <>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="existing-food-label">
            Existing Food
          </InputLabel>

          <Select
            labelId="existing-food-label"
            value={selectedFoodId}
            label="Existing Food"
            onChange={(event) =>
              setSelectedFoodId(event.target.value)
            }
          >
            {foods.length === 0 ? (
              <MenuItem disabled>
                No foods saved yet
              </MenuItem>
            ) : (
              foods.map((food) => (
                <MenuItem key={food.id} value={food.id}>
                  {food.name} — {food.serving_size}{" "}
                  {food.serving_unit}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Button
          sx={{ mt: 2 }}
          onClick={() => setShowNewFoodForm(true)}
        >
          Enter a new food
        </Button>
      </>
    ) : (
      <Box sx={{ mt: 1 }}>
        <TextField
          fullWidth
          required
          label="Food name"
          name="name"
          value={newFood.name}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          type="number"
          label="Serving size"
          name="serving_size"
          value={newFood.serving_size}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          label="Serving unit"
          name="serving_unit"
          placeholder="g, oz, cup, piece"
          value={newFood.serving_unit}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          type="number"
          label="Calories"
          name="calories"
          value={newFood.calories}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          type="number"
          label="Protein grams"
          name="protein_grams"
          value={newFood.protein_grams}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          type="number"
          label="Carbohydrate grams"
          name="carbs_grams"
          value={newFood.carbs_grams}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          required
          type="number"
          label="Fat grams"
          name="fat_grams"
          value={newFood.fat_grams}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <TextField
          fullWidth
          type="number"
          label="Caffeine"
          name="caffeine"
          value={newFood.caffeine}
          onChange={handleFoodInputChange}
          margin="normal"
        />

        <Button
          sx={{ mt: 1 }}
          onClick={() => setShowNewFoodForm(false)}
        >
          Choose an existing food instead
        </Button>
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button
      onClick={handleCloseFoodDialog}
      disabled={foodLoading}
    >
      Cancel
    </Button>

    {!showNewFoodForm ? (
      <Button
        variant="contained"
        onClick={handleAddExistingFood}
        disabled={foodLoading || !selectedFoodId}
      >
        {foodLoading ? "Adding..." : "Add Food"}
      </Button>
    ) : (
      <Button
        variant="contained"
        onClick={handleCreateAndAddFood}
        disabled={foodLoading}
      >
        {foodLoading ? "Saving..." : "Save and Add Food"}
      </Button>
    )}
  </DialogActions>
</Dialog>
    </Box>
  );
}
