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
  TextField,
} from "@mui/material";

export default function FoodDialog({
  selectedMeal,
  selectedFoodId,
  setSelectedFoodId,
  foods,
  showNewFoodForm,
  setShowNewFoodForm,
  newFood,
  foodLoading,
  onFoodInputChange,
  onClose,
  onAddExistingFood,
  onCreateAndAddFood,
}) {
  return (
    <Dialog
      open={Boolean(selectedMeal)}
      onClose={onClose}
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
              onChange={onFoodInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              type="number"
              label="Serving size"
              name="serving_size"
              value={newFood.serving_size}
              onChange={onFoodInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              label="Serving unit"
              name="serving_unit"
              placeholder="g, oz, cup, piece"
              value={newFood.serving_unit}
              onChange={onFoodInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              type="number"
              label="Calories"
              name="calories"
              value={newFood.calories}
              onChange={onFoodInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              type="number"
              label="Protein grams"
              name="protein_grams"
              value={newFood.protein_grams}
              onChange={onFoodInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              type="number"
              label="Carbohydrate grams"
              name="carbs_grams"
              value={newFood.carbs_grams}
              onChange={onFoodInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              type="number"
              label="Fat grams"
              name="fat_grams"
              value={newFood.fat_grams}
              onChange={onFoodInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              type="number"
              label="Caffeine"
              name="caffeine"
              value={newFood.caffeine}
              onChange={onFoodInputChange}
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
        <Button onClick={onClose} disabled={foodLoading}>
          Cancel
        </Button>

        {!showNewFoodForm ? (
          <Button
            variant="contained"
            onClick={onAddExistingFood}
            disabled={foodLoading || !selectedFoodId}
          >
            {foodLoading ? "Adding..." : "Add Food"}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onCreateAndAddFood}
            disabled={foodLoading}
          >
            {foodLoading ? "Saving..." : "Save and Add Food"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
