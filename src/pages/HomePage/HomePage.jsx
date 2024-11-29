import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import styles from "./HomePage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import AddCategoryForm from "../../forms/CategoryForm/AddCategoryForm";
import { API_URL } from "../../utils/api";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Sveiki atvykę į savaitės maisto plano sistemą!");
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`); 
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data); // Grąžiname visus kategorijos objektus
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const newCategoryData = await response.json();
      setCategories([...categories, newCategoryData]);
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setShowForm(false); 
    }
  };

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {/* Hero sekcija */}
      <div className={styles.hero}>
        <h1>Savaitės Maisto Planas</h1>
        <p>Sistema, leidžianti sudaryti ir valdyti savaitės maisto planą, pritaikytą įvairioms žmonių grupėms.</p>
        <button onClick={() => setMessage("Pradėkite kurti savo savaitės maisto planą jau dabar!")}>
          Prisijungti
        </button>
        <p>{message}</p>
      </div>

      {/* Kategorijų sąrašas */}
      <div className={styles.categories}>
        <h2>Pasirinkite kategoriją</h2>
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link key={category._id} to={`/categories/${category._id}`} className={styles.card}>
              <div>
                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mygtukas ir forma */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className={styles.addCategoryButton}
          >
            {showForm ? "Slėpti formą" : "Pridėti kategoriją"}
          </button>

          {/* Forma */}
          {showForm && <AddCategoryForm onSubmit={handleAddCategory} />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;


