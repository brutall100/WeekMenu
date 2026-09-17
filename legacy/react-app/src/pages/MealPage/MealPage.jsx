import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../utils/api";
import styles from "./MealPage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const MealPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeal, setEditedMeal] = useState({ categoryIds: [], ingredients: [] });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch meal
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`${API_URL}/meals/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meal");
        }
        const data = await response.json();

        const categoryIds = (data.categories || []).map((cat) => {
          if (typeof cat === "object" && cat._id) return cat._id;
          const matchedCategory = categories.find((c) => c.name === cat);
          return matchedCategory ? matchedCategory._id : null;
        }).filter(Boolean);

        setMeal(data);
        setEditedMeal({
          ...data,
          categoryIds: categoryIds || [],
        });
      } catch (error) {
        console.error("Error fetching meal:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchMeal();
    }
  }, [id, categories]);

  const handleEditButtonClick = () => {
    setEditedMeal({
      ...meal,
      categoryIds: (meal.categories || []).map((cat) => {
        if (typeof cat === "object" && cat._id) return cat._id;
        const matchedCategory = categories.find((c) => c.name === cat);
        return matchedCategory ? matchedCategory._id : null;
      }).filter(Boolean),
    });
    setIsEditing(true);
  };

  const handleCategoryToggle = (categoryId) => {
    const updatedCategoryIds = editedMeal.categoryIds.includes(categoryId)
      ? editedMeal.categoryIds.filter((id) => id !== categoryId)
      : [...editedMeal.categoryIds, categoryId];

    setEditedMeal((prev) => ({
      ...prev,
      categoryIds: updatedCategoryIds,
    }));
  };

  const handleAddIngredient = () => {
    setEditedMeal((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: "", quantity: "", calories: "", nutritionalValue: { protein: "", fat: "", carbs: "" } },
      ],
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...editedMeal.ingredients];
    if (field in updatedIngredients[index]) {
      updatedIngredients[index][field] = value;
    } else if (field in updatedIngredients[index].nutritionalValue) {
      updatedIngredients[index].nutritionalValue[field] = value;
    }
    setEditedMeal((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleUpdateMeal = async () => {
    try {
      // Užtikrink, kad ingredients yra masyvas
      const ingredientIds = (editedMeal.ingredients || []).map((ingredient) => ingredient._id || ingredient);
  
      const updatedMealData = {
        ...editedMeal,
        ingredientIds,
      };
  
      const response = await fetch(`${API_URL}/meals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMealData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update meal");
      }
  
      const updatedMeal = await fetch(`${API_URL}/meals/${id}`).then((res) => res.json());
      setMeal(updatedMeal);
      setEditedMeal({
        ...updatedMeal,
        categoryIds: updatedMeal.categories.map((cat) => (cat._id ? cat._id : cat)),
      });
      setIsEditing(false);
      toast.success("Patiekalo informacija sėkmingai atnaujinta!");
    } catch (error) {
      console.error("Error updating meal:", error);
      toast.error("Nepavyko atnaujinti patiekalo informacijos.");
    }
  };
  

  const handleDeleteMeal = async () => {
    try {
      const response = await fetch(`${API_URL}/meals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete meal");
      }
      navigate("/meals");
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

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
    <>
      <div className={styles.mealPage}>
        <div className={styles.contentContainer}>
          <div className={styles.header}>
            <Link to="/meals" className={styles.backLink}>
              Grįžti į visus patiekalus
            </Link>
          </div>
  
          {!isEditing ? (
            <div className={styles.viewContainer}>
              <h1 className={styles.mealTitle}>{meal.name}</h1>
              <p className={styles.mealDescription}>{meal.description}</p>
              <div className={styles.categoriesSection}>
                <p>
                  <strong>Tinkamas:</strong>{" "}
                  {meal.categories?.length > 0 ? meal.categories.join(", ") : "Nėra kategorijų."}
                </p>
              </div>
              <div className={styles.ingredientsSection}>
                <h2>Ingredientai</h2>
                {meal.ingredients?.length > 0 ? (
                  <ul className={styles.ingredientList}>
                    {meal.ingredients.map((ingredient, index) => (
                      <li key={index} className={styles.ingredientItem}>
                        <p><strong>Pavadinimas:</strong> {ingredient.name}</p>
                        <p><strong>Kiekis:</strong> {ingredient.quantity}</p>
                        <p><strong>Kalorijos:</strong> {ingredient.calories}</p>
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
              <div className={styles.buttonContainer}>
                <button className={styles.editButton} onClick={handleEditButtonClick}>Redaguoti</button>
                <button className={styles.deleteButton} onClick={handleDeleteMeal}>Ištrinti</button>
              </div>
            </div>
          ) : (
            <div className={styles.editContainer}>
              <h2>Redaguoti patiekalą</h2>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={editedMeal.name}
                  onChange={(e) => setEditedMeal({ ...editedMeal, name: e.target.value })}
                  placeholder="Patiekalo pavadinimas"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.inputGroup}>
                <textarea
                  value={editedMeal.description}
                  onChange={(e) => setEditedMeal({ ...editedMeal, description: e.target.value })}
                  placeholder="Aprašymas"
                  className={styles.textArea}
                />
              </div>
              <div className={styles.categoriesSection}>
                <h2>Tinka</h2>
                <div className={styles.checkboxGroup}>
                  {categories.map((category) => (
                    <label key={category._id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={editedMeal.categoryIds.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.ingredientsSection}>
                <h2>Ingredientai</h2>
                <button onClick={handleAddIngredient} className={styles.addIngredientButton}>
                  Pridėti ingredientą
                </button>
                {editedMeal.ingredients.map((ingredient, index) => (
                  <div key={index} className={styles.ingredientInputGroup}>
                    <input
                      type="text"
                      value={ingredient.name}
                      placeholder="Pavadinimas"
                      onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      value={ingredient.quantity}
                      placeholder="Kiekis"
                      onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                      className={styles.inputField}
                    />
                    <input
                      type="number"
                      value={ingredient.calories}
                      placeholder="Kalorijos"
                      onChange={(e) => handleIngredientChange(index, "calories", e.target.value)}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      value={ingredient.nutritionalValue.protein}
                      placeholder="Baltymai"
                      onChange={(e) => handleIngredientChange(index, "protein", e.target.value)}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      value={ingredient.nutritionalValue.fat}
                      placeholder="Riebalai"
                      onChange={(e) => handleIngredientChange(index, "fat", e.target.value)}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      value={ingredient.nutritionalValue.carbs}
                      placeholder="Angliavandeniai"
                      onChange={(e) => handleIngredientChange(index, "carbs", e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.buttonContainer}>
                <button className={styles.saveButton} onClick={handleUpdateMeal}>Išsaugoti</button>
                <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Atšaukti</button>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
  
};

export default MealPage;











