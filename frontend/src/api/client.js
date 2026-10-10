import { API_URL } from "../config";

export async function fetchPriorities(capacity, signal) {
  const url = new URL(API_URL);
  url.searchParams.set("capacity", String(capacity));

  let response;
  try {
    response = await fetch(url.toString(), { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    const error = new Error(
      "Could not reach the AquaPrior API. This is usually a network problem or a CORS setting on the AWS Lambda URL."
    );
    error.kind = "network";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`The API responded with status ${response.status}.`);
    error.kind = "http";
    throw error;
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.areas)) {
    const error = new Error("The API response did not contain a list of areas.");
    error.kind = "shape";
    throw error;
  }

  return data;
}