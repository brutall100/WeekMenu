import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import WeekPlanPage from "./pages/WeekPlanPage/WeekPlanPage";
import MealPage from "./pages/MealPage/MealPage";
import AllMealsPage from "./pages/AllMealsPage/AllMealsPage";
import AllMealsByCategoryPage from "./pages/AllMealsByCategoryPage/AllMealsByCategoryPage";
import StoriesPage from "./pages/StoriesPage/StoriesPage";
import { StoriesProvider } from "./context/StoriesContext"; 

function App() {
  return (
    <>
      <Header />
      <StoriesProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:id" element={<WeekPlanPage />} />
          <Route path="/meals" element={<AllMealsPage />} />
          <Route path="/meals/:id" element={<MealPage />} />
          <Route path="/categories/:id/meals" element={<AllMealsByCategoryPage />} /> 
        </Routes>
      </StoriesProvider>
      <Footer />
    </>
  );
}

export default App;
