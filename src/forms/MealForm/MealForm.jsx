import React, { useState, useEffect } from "react";
import { API_URL } from "../../utils/api"; 
import styles from "./MealForm.module.scss";

const AddMealForm = ({ onAddMeal }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    // Užkrauname kategorijas iš DB
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

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: "",
        quantity: "",
        calories: "",
        nutritionalValue: { protein: "", fat: "", carbs: "" },
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    if (field in updatedIngredients[index]) {
      updatedIngredients[index][field] = value;
    } else if (field in updatedIngredients[index].nutritionalValue) {
      updatedIngredients[index].nutritionalValue[field] = value;
    }
    setIngredients(updatedIngredients);
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryIds.includes(categoryId)) {
      setCategoryIds(categoryIds.filter((id) => id !== categoryId)); // Pašaliname iš sąrašo
    } else {
      setCategoryIds([...categoryIds, categoryId]); // Pridedame prie sąrašo
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || categoryIds.length === 0 || ingredients.length === 0) {
      alert("Užpildykite visus laukus ir pasirinkite bent vieną kategoriją bei pridėkite ingredientus.");
      return;
    }

    const mealData = {
      name,
      description,
      categoryIds,
      ingredients,
    };

    onAddMeal(mealData);
    setName("");
    setDescription("");
    setCategoryIds([]);
    setIngredients([]);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.mealForm}>
      <input
        type="text"
        placeholder="Patiekalo pavadinimas"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Aprašymas"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Kategorijos:</label>
      <div className={styles.categoryCheckboxes}>
        {categories.map((category) => (
          <div key={category._id} className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id={`category-${category._id}`}
              value={category._id}
              checked={categoryIds.includes(category._id)}
              onChange={() => handleCategoryChange(category._id)}
            />
            <label htmlFor={`category-${category._id}`}>{category.name}</label>
          </div>
        ))}
      </div>

      <label>Ingredientai:</label>
      <button type="button" onClick={handleAddIngredient} className={styles.addButton}>
        Pridėti ingredientą
      </button>
      {ingredients.map((ingredient, index) => (
        <div key={index} className={styles.ingredientRow}>
          <input
            type="text"
            placeholder="Pavadinimas"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Kiekis"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
          />
          <input
            type="number"
            placeholder="Kalorijos"
            value={ingredient.calories}
            onChange={(e) => handleIngredientChange(index, "calories", e.target.value)}
          />
          <input
            type="text"
            placeholder="Baltymai"
            value={ingredient.nutritionalValue.protein}
            onChange={(e) => handleIngredientChange(index, "protein", e.target.value)}
          />
          <input
            type="text"
            placeholder="Riebalai"
            value={ingredient.nutritionalValue.fat}
            onChange={(e) => handleIngredientChange(index, "fat", e.target.value)}
          />
          <input
            type="text"
            placeholder="Angliavandeniai"
            value={ingredient.nutritionalValue.carbs}
            onChange={(e) => handleIngredientChange(index, "carbs", e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveIngredient(index)}
            className={styles.removeButton}
          >
            Pašalinti
          </button>
        </div>
      ))}

      <button type="submit" className={styles.submitButton}>Pridėti patiekalą</button>
    </form>
  );
};

export default AddMealForm;







