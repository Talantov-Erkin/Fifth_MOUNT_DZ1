import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

export const getProducts = async (limit = 20) => {
  const { data } = await api.get("/products", { params: { limit } });
  return data.products;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const getOldPrice = (price, discount) =>
  (price / (1 - discount / 100)).toFixed(2);
