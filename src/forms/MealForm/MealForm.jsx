import React, { useState, useEffect } from "react";

const AddMealForm = ({ onAddMeal }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data); // Assuming categories come as an array of objects with id and name
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !description || categoryIds.length === 0) {
      alert("Please fill out all fields and select at least one category.");
      return;
    }

    const mealData = {
      name,
      description,
      categoryIds,
    };

    onAddMeal(mealData); // Pass meal data to parent component
    setName("");
    setDescription("");
    setCategoryIds([]); // Reset the category selection
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Patiekalo pavadinimas"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Aprašymas"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        multiple
        value={categoryIds}
        onChange={(e) =>
          setCategoryIds(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
      >
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <button type="submit">Pridėti</button>
    </form>
  );
};

export default AddMealForm;


