import useMediaQuery from "@mui/material/useMediaQuery";
import useMeals from "./useMeals";
import MealsDesktop from "./MealsDesktop";
import MealsMobile from "./MealsMobile";
import FoodDialog from "./FoodDialog";

export default function MealsNew({ dailyLogId, userId }) {
  const isPhone = useMediaQuery("(max-width: 600px)");

  const mealData = useMeals({
    dailyLogId,
    userId,
  });

  const layoutProps = {
    ...mealData,
    userId,
  };

  return (
    <>
      {mealData.error && (
        <p style={{ color: "red" }}>
          {mealData.error}
        </p>
      )}

      {mealData.loadingMeals ? (
        <p>Loading meals...</p>
      ) : isPhone ? (
        <MealsMobile {...layoutProps} />
      ) : (
        <MealsDesktop {...layoutProps} />
      )}

      <FoodDialog
        selectedMeal={mealData.selectedMeal}
        selectedFoodId={mealData.selectedFoodId}
        setSelectedFoodId={mealData.setSelectedFoodId}
        foods={mealData.foods}
        showNewFoodForm={mealData.showNewFoodForm}
        setShowNewFoodForm={mealData.setShowNewFoodForm}
        newFood={mealData.newFood}
        setNewFood={mealData.setNewFood}
        foodLoading={mealData.foodLoading}
        onClose={mealData.handleCloseFoodDialog}
        onAddExistingFood={mealData.handleAddExistingFood}
      />
    </>
  );
}
