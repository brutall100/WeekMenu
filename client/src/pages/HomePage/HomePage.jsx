import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import AddCategoryForm from "../../forms/CategoryForm//AddCategoryForm";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Sveiki atvykę į savaitės maisto plano sistemą!");
  const [categories, setCategories] = useState([
    "Diabetikams",
    "Nėščiosioms",
    "Sportininkams",
    "Nutukusiems",
    "Vaikams",
    "Vegetarams",
    "Be glitimo",
    "Keto",
    "Pagyvenusiems",
    "Alergiškiems",
  ]);
  const [showForm, setShowForm] = useState(false); // Valdo formos rodymą

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowForm(false); // Paslėpti formą po pridėjimo
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
          {categories.map((category, index) => (
            <div key={index} className={styles.card}>
              <h3>{category}</h3>
            </div>
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

