import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../utils/api";
import styles from "./CategoryPage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const CategoryPage = () => {
  const { id } = useParams();
  const [meals, setMeals] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [randomizedDays, setRandomizedDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndMeals = async () => {
      try {
        // Gauti kategorijos pavadinimą
        const categoryResponse = await fetch(`${API_URL}/categories/${id}`);
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category");
        }
        const categoryData = await categoryResponse.json();
        setCategoryName(categoryData.name);

        // Gauti patiekalus
        const mealsResponse = await fetch(`${API_URL}/categories/${id}/meals`);
        if (!mealsResponse.ok) {
          throw new Error("Failed to fetch meals");
        }
        const mealsData = await mealsResponse.json();
        setMeals(mealsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndMeals();
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

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      <h1>Maisto planas {categoryName && `: ${categoryName}`}</h1>
      {randomizedDays.length === 0 ? (
        <p>Nėra maisto plano šiai kategorijai.</p>
      ) : (
        <div className={styles.dayList}>
          {randomizedDays.map((dayPlan, index) => (
            <div key={index} className={styles.dayCard}>
              <h2>{dayPlan.day}</h2>
              <div className={styles.mealCard}>
                <h3>{dayPlan.meal.name}</h3>
                <p>{dayPlan.meal.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;




