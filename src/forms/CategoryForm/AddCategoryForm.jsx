import React, { useState } from "react";
import styles from "./AddCategoryForm.module.scss";

const AddCategoryForm = ({ onSubmit }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim() === "") {
      alert("Kategorijos pavadinimas negali būti tuščias.");
      return;
    }
    onSubmit(categoryName);
    setCategoryName("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Kategorijos pavadinimas:
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className={styles.input}
          placeholder="Įveskite kategorijos pavadinimą"
        />
      </label>
      <button type="submit" className={styles.submitButton}>
        Pridėti kategoriją
      </button>
    </form>
  );
};

export default AddCategoryForm;
