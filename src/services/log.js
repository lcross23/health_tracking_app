import { supabase } from "../lib/supabase";

export async function getOrCreateDailyLog(logDate) {
  const { data, error } = await supabase.rpc(
    "get_or_create_daily_log",
    {
      requested_date: logDate,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

export async function getMeals(dailyLogId, userId) {
  const { data: meals, error: mealsError } = await supabase
    .from("meals")
    .select("*")
    .eq("daily_log_id", dailyLogId)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: true,
      nullsFirst: false,
    });

  if (mealsError) {
    throw mealsError;
  }

  if (!meals || meals.length === 0) {
    return [];
  }

  const mealIds = meals.map((meal) => meal.id);

  const { data: mealItems, error: itemsError } = await supabase
    .from("meal_items")
    .select("id, meal_id, calories")
    .in("meal_id", mealIds)
    .eq("user_id", userId);

  if (itemsError) {
    throw itemsError;
  }

  return meals.map((meal) => {
    const itemsForMeal = (mealItems || []).filter(
      (item) => item.meal_id === meal.id
    );

    const caloriesTotal = itemsForMeal.reduce(
      (total, item) => total + Number(item.calories || 0),
      0
    );
    const proteinTotal = itemsForMeal.reduce(
      (total, item) => total + Number(item.protein_grams || 0),
      0
    );

    return {
      ...meal,
      calories_total: caloriesTotal,
      protein_total: proteinTotal,
    };
  });
}


export async function addMeal(dailyLogId, userId, mealType) {
  const { data, error } = await supabase
    .from("meals")
    .insert({
      daily_log_id: dailyLogId,
      user_id: userId,
      meal_type: mealType,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}



export async function deleteMeal(entryId) {
  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}




export async function getFoods(userId) {
  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function createFood(userId, food) {
  const { data, error } = await supabase
    .from("foods")
    .insert({
      user_id: userId,
      name: food.name,
      serving_size: Number(food.serving_size),
      serving_unit: food.serving_unit,
      calories: Number(food.calories),
      protein_grams: Number(food.protein_grams),
      carbs_grams: Number(food.carbs_grams),
      fat_grams: Number(food.fat_grams),
      caffeine: Number(food.caffeine || 0),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addMealItem(mealId, userId,food) {
  const { data, error } = await supabase
    .from("meal_items")
    .insert({
      user_id:userId,
      meal_id: mealId,
      name: food.name,
      serving_size: Number(food.serving_size),
      serving_unit: food.serving_unit,
      calories: Number(food.calories),
      protein_grams: Number(food.protein_grams),
      carbs_grams: Number(food.carbs_grams),
      fat_grams: Number(food.fat_grams),
      caffeine: Number(food.caffeine || 0),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getMealItems(mealIds, userId) {
  if (!mealIds.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("meal_items")
    .select("*")
    .eq("user_id", userId)
    .in("meal_id", mealIds)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteMealItem(entryId) {
  const { error } = await supabase
    .from("meal_items")
    .delete()
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}