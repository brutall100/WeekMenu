import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { API_URL } from "../../utils/api";
import styles from "./AllMealsByCategoryPage.module.scss";

const MealsPage = () => {
  const { id } = useParams(); 
  const [meals, setMeals] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealsAndCategory = async () => {
      try {
        const [categoryResponse, mealsResponse] = await Promise.all([
          fetch(`${API_URL}/categories/${id}`),
          fetch(`${API_URL}/categories/${id}/meals`),
        ]);

        const categoryData = await categoryResponse.json();
        const mealsData = await mealsResponse.json();

        setCategoryName(categoryData.name);
        setMeals(mealsData);
      } catch (error) {
        console.error("Error fetching meals or category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealsAndCategory();
  }, [id]);

  const handleMealClick = (mealId) => {
    navigate(`/meals/${mealId}`); 
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
    );
  }

  return (
    <div className={styles.mealsPage}>
      <h1>Patiekalai kategorijai: {categoryName}</h1>
      <div className={styles.mealsGrid}>
        {meals.map((meal) => (
          <div
            key={meal._id}
            className={styles.mealCard}
            onClick={() => handleMealClick(meal._id)} 
          >
            <h2>{meal.name}</h2>
            <p>{meal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsPage;


