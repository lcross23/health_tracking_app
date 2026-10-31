import{useState} from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MealsMobile({
  meals,
  mealItems,
  deletingMealId,
  deletingMealItemId,
  handleDeleteMeal,
  handleDeleteMealItem,
  handleOpenFoodDialog,
  options = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Snack", label: "Snack" },
    { value: "Pre-workout", label: "Pre-workout" },
    { value: "Post-workout", label: "Post-workout" },
    { value: "Other", label: "Other" },
  ],
  handleAddMeal,
  loading,
}) {
  const [selectedValue, setSelectedValue] = useState("");

  async function handleAddSelectedMeal() {
    if (!selectedValue) {
      return;
    }

    await handleAddMeal(selectedValue);
    setSelectedValue("");
  }
  return (
    <Stack spacing={2}>
      <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="meal-type-label">
            Meal
          </InputLabel>

          <Select
            labelId="meal-type-label"
            id="meal-type"
            value={selectedValue}
            label="Meal"
            onChange={(event) => {
              setSelectedValue(event.target.value);
            }}
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
          onClick={handleAddSelectedMeal}
          disabled={loading || !selectedValue}
        >
          {loading ? "Adding..." : "Add Meal"}
        </Button>
      {meals.map((meal) => {
        const itemsForMeal = mealItems.filter(
          (item) => item.meal_id === meal.id
        );

        return (
          <Accordion key={meal.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ width: "100%", pr: 1 }}
              >
                <Typography>
                  {meal.meal_type} - {meal.calories_total || 0} kcal / {meal.protein_total} g
                </Typography>
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={2}>
                {itemsForMeal.map((item) => (
                  <Card key={item.id} variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="h6">
                          {item.name}
                        </Typography>

                        <Typography color="text.secondary">
                          {item.serving_size}{" "}
                          {item.serving_unit}
                        </Typography>

                        <Typography>
                          {item.calories} kcal
                        </Typography>

                        <Button
                          color="error"
                          onClick={() =>
                            handleDeleteMealItem(item.id)
                          }
                          disabled={
                            deletingMealItemId === item.id
                          }
                        >
                          {deletingMealItemId === item.id
                            ? "Deleting..."
                            : "Delete Food"}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="contained"
                  onClick={() => handleOpenFoodDialog(meal)}
                  fullWidth
                >
                  Add Food
                </Button>

                <Button
                  color="error"
                  onClick={() => handleDeleteMeal(meal.id)}
                  disabled={deletingMealId === meal.id}
                  fullWidth
                >
                  {deletingMealId === meal.id
                    ? "Deleting..."
                    : "Delete Meal"}
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
