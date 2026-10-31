import { supabase } from "../lib/supabase";

function mapFoodFromDatabase(food) {
  return {
    id: food.id,
    userId: food.user_id,
    name: food.name,
    servingSize: food.serving_size,
    servingUnit: food.serving_unit,
    calories: food.calories,
    protein: food.protein_grams,
    carbs: food.carbs_grams,
    fat: food.fat_grams,
    caffeine: food.caffeine,
    ingredients: food.ingredients
  };
}


export async function getFoodList(userId) {
  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapFoodFromDatabase);
}

export async function createFood(userId, food) {
  const { data, error } = await supabase
    .from("foods")
    .insert({
      user_id: userId,
      name: food.name,
      serving_size: food.servingSize,
      serving_unit: food.servingUnit,
      calories: food.calories,
      protein_grams: food.protein,
      carbs_grams: food.carbs,
      fat_grams: food.fat,
      caffeine: food.caffeine,
      ingredients: food.ingredients,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapFoodFromDatabase(data);
}
export async function deleteFood(foodId, userId) {
  const { error } = await supabase
    .from("foods")
    .delete()
    .eq("id", foodId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}