import React from "react";

const categories = [
  "Diabetikams",
  "Nėščiosioms",
  "Sportininkams",
  "Nutukusiems",
  "Vaikams",
  "Vegetarams",
  "Be glitimo",
  "Ketogeninė dieta",
  "Pagyvenusiems",
  "Maisto alergijoms",
];

const CategoryList = ({ onCategorySelect }) => {
  return (
    <div>
      <h2>Pasirinkite kategoriją:</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index} onClick={() => onCategorySelect(category)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
