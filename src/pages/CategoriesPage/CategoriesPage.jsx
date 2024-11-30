import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/api";
import styles from "./CategoriesPage.module.scss";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className={styles.categoriesPage}>
      <h1>Categories</h1>
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link
            to={`/categories/${category._id}`}
            key={category._id}
            className={styles.categoryCard}
          >
            <h2>{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
