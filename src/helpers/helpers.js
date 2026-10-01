import axios from "axios"

// Один раз создаём настроенный экземпляр axios,
// чтобы не писать полный адрес в каждом запросе
const api = axios.create({
  baseURL: "https://dummyjson.com",
})

// GET /products?limit=20 — список товаров
export const getProducts = async (limit = 20) => {
  const { data } = await api.get("/products", { params: { limit } })
  return data.products
}

// GET /products/:id — один конкретный товар
export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

// Цена до скидки: price = old * (1 - discount / 100)  =>  old = price / (1 - discount / 100)
export const getOldPrice = (price, discount) =>
  (price / (1 - discount / 100)).toFixed(2)