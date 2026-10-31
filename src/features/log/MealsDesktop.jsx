import { Fragment, useState } from "react";

import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function MealsDesktop({
  meals,
  mealItems,
  options = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Snack", label: "Snack" },
    { value: "Pre-workout", label: "Pre-workout" },
    { value: "Post-workout", label: "Post-workout" },
    { value: "Other", label: "Other" },
  ],
  expandedMeals = {},
  toggleMealExpanded,
  deletingMealId,
  deletingMealItemId,
  handleDeleteMeal,
  handleDeleteMealItem,
  handleOpenFoodDialog,
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
    <Box>
      {/* Add meal controls */}
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
      </Box>

      {/* Meals table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Meal</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Protein</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Add Food</TableCell>
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

            const isExpanded = Boolean(
              expandedMeals[meal.id]
            );

            return (
              <Fragment key={meal.id}>
                {/* Main meal row */}
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        toggleMealExpanded(meal.id)
                      }
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
                    {meal.calories_total || 0} kcal
                  </TableCell>

                  <TableCell>
                    {meal.protein_total || 0} g
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        handleDeleteMeal(meal.id)
                      }
                      disabled={
                        deletingMealId === meal.id
                      }
                    >
                      {deletingMealId === meal.id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() =>
                        handleOpenFoodDialog(meal)
                      }
                    >
                      Add Food
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded food row */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      paddingTop: 0,
                      paddingBottom: 0,
                      borderBottom: isExpanded
                        ? undefined
                        : "none",
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
                                <TableCell>
                                  Calories
                                </TableCell>
                                <TableCell>
                                  Protein
                                </TableCell>
                                <TableCell>Carbs</TableCell>
                                <TableCell>Fat</TableCell>
                                <TableCell>
                                  Caffeine
                                </TableCell>
                                <TableCell>
                                  Delete
                                </TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {itemsForMeal.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    {item.name}
                                  </TableCell>

                                  <TableCell>
                                    {item.serving_size}{" "}
                                    {item.serving_unit}
                                  </TableCell>

                                  <TableCell>
                                    {item.calories || 0}
                                  </TableCell>

                                  <TableCell>
                                    {item.protein_grams || 0} g
                                  </TableCell>

                                  <TableCell>
                                    {item.carbs_grams || 0} g
                                  </TableCell>

                                  <TableCell>
                                    {item.fat_grams || 0} g
                                  </TableCell>

                                  <TableCell>
                                    {item.caffeine || 0}
                                  </TableCell>

                                  <TableCell>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      startIcon={
                                        <DeleteIcon />
                                      }
                                      onClick={() =>
                                        handleDeleteMealItem(
                                          item.id
                                        )
                                      }
                                      disabled={
                                        deletingMealItemId ===
                                        item.id
                                      }
                                    >
                                      {deletingMealItemId ===
                                      item.id
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
              <TableCell colSpan={6}>
                No meals added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
