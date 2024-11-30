import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/api";
import styles from "./AllMealsPage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const AllMealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${API_URL}/meals`);
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
    );
  }

  return (
    <div className={styles.allMealsPage}>
      <h1>Visi patiekalai</h1>
      <div className={styles.mealsGrid}>
        {meals.map((meal) => (
          <div key={meal._id} className={styles.mealCard}>
            <h2>{meal.name}</h2>
            <p>{meal.description}</p>
            <Link to={`/meals/${meal._id}`} className={styles.detailsLink}>
              Plačiau
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMealsPage;
