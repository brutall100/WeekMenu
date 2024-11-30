import React from "react";
import { Link } from "react-router-dom";
import styles from "./DayPlanCard.module.scss";

const DayPlanCard = ({ day, meal }) => {
  return (
    <div className={styles.dayCard}>
      <h2>{day}</h2>
      <div className={styles.mealCard}>
        <Link to={`/meals/${meal._id}`} className={styles.mealLink}>
          <h3>{meal.name}</h3>
          <p>{meal.description}</p>
        </Link>
      </div>
    </div>
  );
};

export default DayPlanCard;
