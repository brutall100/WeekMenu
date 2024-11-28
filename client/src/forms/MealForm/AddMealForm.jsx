import React, { useState } from "react";

const AddMealForm = ({ onAddMeal }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMeal({ name, description });
    setName("");
    setDescription("");
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
      <button type="submit">Pridėti</button>
    </form>
  );
};

export default AddMealForm;
