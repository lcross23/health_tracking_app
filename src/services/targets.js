import { supabase } from "../lib/supabase";

export async function createTarget(userId, calorieGoal, proteinGoal, caffeineLimit,waterGoal) {
  const { data, error } = await supabase
    .from("targets")
    .insert({
      user_id: userId,
      daily_calorie_goal: calorieGoal,
      daily_protein_gram_goal: proteinGoal,
      daily_caffeine_limit: caffeineLimit,
      daily_water_goal: waterGoal
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function getTargetHistory(userId) {
  const { data, error } = await supabase
    .from("targets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentTarget(userId) {
  const { data, error } = await supabase
    .from("targets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
export async function deleteTarget(targetId, userId) {
  const { error } = await supabase
    .from("targets")
    .delete()
    .eq("id", targetId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}