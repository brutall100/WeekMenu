import React, { createContext, useState, useEffect } from "react";
import { API_URL } from "../utils/api";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children, categoryId }) => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/${categoryId}`);
        const data = await response.json();
        setCategoryName(data.name);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return (
    <CategoryContext.Provider value={{ categoryName, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};
