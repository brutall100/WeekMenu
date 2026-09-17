import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import styles from "./HomePage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { API_URL } from "../../utils/api";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Sveiki atvykę į savaitės maisto plano sistemą!");
  const [categories, setCategories] = useState([]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Savaitės Maisto Planas</h1>
        <p>Sistema, leidžianti sudaryti ir valdyti savaitės maisto planą, pritaikytą įvairioms žmonių grupėms.</p>
        <button onClick={() => setMessage("PS. Užkrovimas vyksta apie 50 sekundžių! 😊")}>
          Prisijungti
        </button>
        <p>{message}</p>
      </div>

      {/* Categories List */}
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
      </div>
    </div>
  );
};

export default HomePage;



