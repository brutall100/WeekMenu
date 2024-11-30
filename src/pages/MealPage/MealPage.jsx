import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../utils/api";
import styles from "./MealPage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const MealPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`${API_URL}/meals/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meal");
        }
        const data = await response.json();
        setMeal(data);
      } catch (error) {
        console.error("Error fetching meal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
    );
  }

  if (!meal) {
    return <div>Patiekalo informacija nerasta.</div>;
  }

  return (
    <div className={styles.mealPage}>
      <h1>{meal.name}</h1>
      <p>{meal.description}</p>
      <p>
        <strong>Kategorijos:</strong>{" "}
        {meal.categories && meal.categories.length > 0
          ? meal.categories.join(", ")
          : "Nėra kategorijų."}
      </p>
      <h2>Ingredientai</h2>
      {meal.ingredients && meal.ingredients.length > 0 ? (
        <ul className={styles.ingredientList}>
          {meal.ingredients.map((ingredient, index) => (
            <li key={index} className={styles.ingredientItem}>
              <p>
                <strong>Pavadinimas:</strong> {ingredient.name}
              </p>
              <p>
                <strong>Kiekis:</strong> {ingredient.quantity}
              </p>
              <p>
                <strong>Kalorijos:</strong> {ingredient.calories}
              </p>
              <p>
                <strong>Maistinė vertė:</strong>{" "}
                {`Baltymai: ${ingredient.nutritionalValue.protein}, Riebalai: ${ingredient.nutritionalValue.fat}, Angliavandeniai: ${ingredient.nutritionalValue.carbs}`}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Ingredientų nėra.</p>
      )}
    </div>
  );
};

export default MealPage;

