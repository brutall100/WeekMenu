import React from "react";

const PlanItem = ({ plan }) => {
  return (
    <div>
      <h3>{plan.day}</h3>
      <ul>
        {plan.meals.map((meal, index) => (
          <li key={index}>
            <strong>{meal.name}</strong>: {meal.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanItem;
