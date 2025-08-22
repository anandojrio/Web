// src/api/categories.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export async function getCategories() {
  return api.get("/categories");
}
