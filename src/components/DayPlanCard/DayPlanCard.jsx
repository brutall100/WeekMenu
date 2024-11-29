import React from "react";
import MealCard from "../MealCard/MealCard";
import styles from "./DayPlanCard.module.scss";

const DayPlanCard = ({ day, meal }) => {
  return (
    <div className={styles.dayCard}>
      <h2>{day}</h2>
      {meal ? <MealCard meal={meal} /> : <p>Nėra patiekalo</p>}
    </div>
  );
};

export default DayPlanCard;
