import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.scss';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const HomePage = () => {
  const [loading, setLoading] = useState(true); // Kraunasi iš pradžių
  const [message, setMessage] = useState('Sveiki atvykę į savaitės maisto plano sistemą!');

  // Simuliuojame įkėlimo procesą
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Po 2 sekundžių nustatome įkėlimą kaip baigtą
    }, 2000);

    return () => clearTimeout(timer); // Išvalome laikmatį, jei komponentas pašalinamas
  }, []);

  const handleClick = () => {
    setMessage('Pradėkite kurti savo savaitės maisto planą jau dabar!');
  };

  const categories = [
    'Diabetikams',
    'Nėščiosioms',
    'Sportininkams',
    'Nutukusiems',
    'Vaikams',
    'Vegetarams',
    'Be glitimo',
    'Keto',
    'Pagyvenusiems',
    'Alergiškiems',
  ];

  // Rodykime įkėlimo elementą, kol kraunasi
  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Hero sekcija */}
      <div className={styles.hero}>
        <h1>Savaitės Maisto Planas</h1>
        <p>Sistema, leidžianti sudaryti ir valdyti savaitės maisto planą, pritaikytą įvairioms žmonių grupėms.</p>
        <button onClick={handleClick}>Prisijungti</button>
        <p>{message}</p>
      </div>

      {/* Kategorijų sąrašas */}
      <div className={styles.categories}>
        <h2>Pasirinkite kategoriją</h2>
        {/* Mygtukas kategorijai pridėti */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => alert('Pridėti kategoriją funkcija dar neveikia.')}
            className={styles.addCategoryButton}
          >
            Pridėti kategoriją
          </button>
        </div>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <div key={index} className={styles.card}>
              <h3>{category}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
