import React from "react";
import PlanItem from "./PlanItem";

const PlanList = ({ plans }) => {
  return (
    <div>
      <h2>Savaitės planas:</h2>
      {plans.map((plan) => (
        <PlanItem key={plan.day} plan={plan} />
      ))}
    </div>
  );
};

export default PlanList;
