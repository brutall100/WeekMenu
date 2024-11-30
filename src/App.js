import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import MealPage from "./pages/MealPage/MealPage";
import AllMealsPage from "./pages/AllMealsPage/AllMealsPage";
import StoriesPage from "./pages/StoriesPage/StoriesPage";
import { StoriesProvider } from "./context/StoriesContext"; // Import StoriesProvider

function App() {
  return (
    <>
      <Header />
      <StoriesProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/meals" element={<AllMealsPage />} />
          <Route path="/meals/:id" element={<MealPage />} />
        </Routes>
      </StoriesProvider>
    </>
  );
}

export default App;
