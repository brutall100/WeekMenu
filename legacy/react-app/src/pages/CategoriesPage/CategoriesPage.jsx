import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { API_URL } from "../../utils/api";
import CategoryForm from "../../forms/CategoryForm/CategoryForm";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./CategoriesPage.module.scss";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((category) => category._id !== id));
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category!");
    }
  };

  const handleSubmit = async (category) => {
    if (editingCategory) {
      try {
        await fetch(`${API_URL}/categories/${editingCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        });
        setCategories(
          categories.map((cat) =>
            cat._id === editingCategory._id ? { ...cat, ...category } : cat
          )
        );
        setEditingCategory(null);
        setFormVisible(false);
        toast.success("Category updated successfully!");
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error("Failed to update category!");
      }
    } else {
      try {
        const response = await fetch(`${API_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        });
        const data = await response.json();
        setCategories([...categories, { _id: data.categoryId, ...category }]);
        setFormVisible(false);
        toast.success("Category added successfully!");
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category!");
      }
    }
  };

  const handleCardClick = (categoryId) => {
    navigate(`/categories/${categoryId}/meals`);
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
    );
  }

  return (
    <div className={styles.categoriesPage}>
      <div className={styles.infoSection}>
        <h1>Pasirinkite savo kategoriją</h1>
        <p>Čia galite pridėti, redaguoti ir ištrinti kategorijas.</p>
        <p>Spustelėkite ant kategorijos, kad pamatytumėte jos patiekalus.</p>
        <p>Spustelėkite ant mygtuko "Pridėti kategoriją", kad pridėtumėte naują kategoriją.</p>
        <button
          className={styles.toggleFormButton}
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? "Slėpti formą" : "Pridėkite kategoriją"}
        </button>
      </div>

      {formVisible && (
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingCategory(null);
            setFormVisible(false);
          }}
        />
      )}

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <div
            key={category._id}
            className={styles.categoryCard}
            onClick={() => handleCardClick(category._id)}
          >
            <h2>{category.name}</h2>
            <div className={styles.cardActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingCategory(category);
                  setFormVisible(true);
                }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(category._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default CategoriesPage;





