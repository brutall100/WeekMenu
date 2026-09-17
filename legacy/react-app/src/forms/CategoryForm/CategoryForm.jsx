import React, { useState, useEffect } from "react";
import styles from "./CategoryForm.module.scss";

const CategoryForm = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
    setName(""); 
  };

  return (
    <div className={styles.categoryForm}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className={styles.formActions}>
          <button type="submit">{initialData ? "Update" : "Add"}</button>
          {initialData && <button type="button" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

