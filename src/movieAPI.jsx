import { API_BASE_URL } from "./config.js";

export function createMovie(movieData) {
  return fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          console.log("Movie created with ID: ", data.id);
        });
      } else if (response.status === 422) {
        return response.json().then((validationData) => {
          console.log(validationData.detail[0].msg);
        });
      } else {
        // Handle other error scenarios
        throw new Error("Error: " + response.statusText);
      }
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error creating movie:", error);
    });
}

export function getByTitle(title = null, skip = 0, limit = 0) {
  return fetch(
    API_BASE_URL +
      "?" +
      new URLSearchParams({
        title: title,
        skip: skip,
        limit: limit,
      })
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 422) {
        return response.json().then((validationData) => {
          console.log(validationData.detail[0].msg);
        });
      } else if (response.status === 404) {
        return response.json().then((validationData) => {
          console.log(validationData.message);
        });
      } else {
        throw new Error("Error: " + response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error fetching movie by title: ", error);
    });
}

export function getAll(skip = 0, limit = 0) {
  return fetch(
    API_BASE_URL +
      "all?" +
      new URLSearchParams({
        skip: skip,
        limit: limit,
      })
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 422) {
        return response.json().then((validationData) => {
          console.log(validationData.detail[0].msg);
        });
      } else if (response.status === 404) {
        return response.json().then((validationData) => {
          console.log(validationData.message);
        });
      } else {
        // Handle other error scenarios
        throw new Error("Error: " + response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error fetching all movies: ", error);
    });
}

export function getByID(movieID) {
  return fetch(API_BASE_URL + movieID)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 422) {
        return response.json().then((validationData) => {
          console.log(validationData.detail[0].msg);
        });
      } else if (response.status === 404) {
        return response.json().then((validationData) => {
          console.log(validationData.message);
        });
      } else {
        // Handle other error scenarios
        throw new Error("Error: " + response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error fetching all movies: ", error);
    });
}
