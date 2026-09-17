import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../utils/api";
import styles from "./AllMealsPage.module.scss";
import AddMealForm from "../../forms/MealForm/MealForm";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const AllMealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const navigate = useNavigate();

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
        toast.error("Nepavyko užkrauti patiekalų."); // Toast for fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleAddMeal = async (mealData) => {
    try {
      const response = await fetch(`${API_URL}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        throw new Error("Failed to add meal");
      }

      const { meal } = await response.json();
      setMeals((prevMeals) => [...prevMeals, meal]);
      setFormVisible(false);
      toast.success("Patiekalas sėkmingai pridėtas!"); // Toast for success
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error("Nepavyko pridėti patiekalo."); // Toast for error
    }
  };

  const handleCardClick = (mealId) => {
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
    <div className={styles.allMealsPage}>
      <h1>Visi patiekalai</h1>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className={styles.mealsGrid}>
        {meals.map((meal) => (
          <div
            key={meal._id}
            className={styles.mealCard}
            onClick={() => handleCardClick(meal._id)}
          >
            <h2>{meal.name}</h2>
            <p>{meal.description}</p>
          </div>
        ))}
      </div>

      <button
        className={styles.toggleFormButton}
        onClick={() => setFormVisible(!formVisible)}
      >
        {formVisible ? "Slėpti formą" : "Pridėti patiekalą"}
      </button>

      {formVisible && (
        <div className={styles.formContainer}>
          <AddMealForm onAddMeal={handleAddMeal} />
        </div>
      )}
    </div>
  );
};

export default AllMealsPage;




