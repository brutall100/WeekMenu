import React from "react";
import styles from "./MealCard.module.scss";

const MealCard = ({ meal }) => {
  return (
    <div className={styles.mealCard}>
      <h3>{meal.name}</h3>
      <p>{meal.description}</p>
    </div>
  );
};

export default MealCard;
