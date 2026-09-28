// Все маршруты в одном месте

import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'products/:id', element: <ProductPage /> }, 
            { path: 'about', element: <AboutPage /> },
            { path: '*', element: <NotFoundPage /> }
        ]
    }
])