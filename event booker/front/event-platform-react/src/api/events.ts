import axios from "axios";

// Adjust the baseURL if your backend is on a different port/domain
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Include if your backend sets httpOnly cookies for auth (optional)
});

export async function getEvents() {
  return api.get("/events");
}

export async function getMostReactedEvents() {
  return api.get("/events/most-reacted");
}

export async function getMostViewedEvents() {
  return api.get("/events/most-viewed");
}
