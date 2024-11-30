import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../utils/api";
import styles from "./CategoryPage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import DayPlanCard from "../../components/DayPlanCard/DayPlanCard";
import { CategoryContext, CategoryProvider } from "../../context/CategoryContext";

const CategoryPage = () => {
  const { id } = useParams();
  const [meals, setMeals] = useState([]);
  const [randomizedDays, setRandomizedDays] = useState([]);
  const { categoryName, loading: categoryLoading } = useContext(CategoryContext);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/${id}/meals`);
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, [id]);

  useEffect(() => {
    if (meals.length > 0) {
      const daysOfWeek = [
        "Pirmadienis",
        "Antradienis",
        "Trečiadienis",
        "Ketvirtadienis",
        "Penktadienis",
        "Šeštadienis",
        "Sekmadienis",
      ];

      const todayIndex = new Date().getDay();
      const todayAdjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

      const orderedDays = [
        ...daysOfWeek.slice(todayAdjustedIndex),
        ...daysOfWeek.slice(0, todayAdjustedIndex),
      ];

      const randomized = orderedDays.map((day) => ({
        day,
        meal: meals[Math.floor(Math.random() * meals.length)],
      }));

      setRandomizedDays(randomized);
    }
  }, [meals]);

  if (categoryLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={categoryLoading} />
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      <h1>Savaites maisto planas : {categoryName}</h1>
      <div className={styles.dayList}>
        {randomizedDays.map((dayPlan, index) => (
          <DayPlanCard key={index} day={dayPlan.day} meal={dayPlan.meal} />
        ))}
      </div>
    </div>
  );
};

const CategoryPageWithProvider = () => {
  const { id } = useParams();
  return (
    <CategoryProvider categoryId={id}>
      <CategoryPage />
    </CategoryProvider>
  );
};

export default CategoryPageWithProvider;





