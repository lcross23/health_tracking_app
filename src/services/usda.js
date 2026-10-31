import { supabase } from "../lib/supabase";

export async function searchFoods(
  query,
  pageNumber = 1,
  pageSize = 25
) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const { data, error } = await supabase.functions.invoke(
    "food-search",
    {
      body: {
        action: "search",
        query: trimmedQuery,
        pageNumber,
        pageSize,
      },
    }
  );

  if (error) {
    throw new Error(error.message || "Unable to search foods.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.foods || [];
}

export async function getFoodDetails(fdcId) {
  if (!fdcId) {
    throw new Error("A USDA food ID is required.");
  }

  const { data, error } = await supabase.functions.invoke(
    "food-search",
    {
      body: {
        action: "details",
        fdcId,
      },
    }
  );

  if (error) {
    throw new Error(
      error.message || "Unable to get food details."
    );
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.food || null;
}
