import { API_BASE_URL } from "./config.js";

export function createMovie(movieData) {
  try {
    return fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });
  } catch (error) {
    console.error("Error occurred during movie create API call:", error);
  }
}

export function updateByID(id, updateParameters) {
  for (const key in updateParameters) {
    if (updateParameters[key] === null) {
      delete updateParameters[key];
    }
    try {
      return fetch(API_BASE_URL + id.toString(), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateParameters),
      });
    } catch (error) {
      console.error("Error occurred during movie update API call:", error);
    }
  }
}

export function deleteByID(id) {
  try {
    return fetch(API_BASE_URL + id.toString(), { method: "DELETE" }).then(
      (response) => {
        if (response.ok) {
          return response.ok;
        } else {
          // Handle other error scenarios
          throw new Error("Error: " + response.statusText);
        }
      }
    );
  } catch (error) {
    console.error("Error occurred during movie deletion:", error);
  }
}

export function getByFields(searchParams) {
  // remove nulls from the search parameters
  for (const key in searchParams) {
    if (searchParams[key] === null) {
      delete searchParams[key];
    }
  }
  // make the API call
  return fetch(API_BASE_URL + "?" + new URLSearchParams(searchParams)).catch(
    (error) => {
      console.error("Error fetching movie by title: ", error);
    }
  );
}

export function getByID(id) {
  return fetch(API_BASE_URL + id);
}
