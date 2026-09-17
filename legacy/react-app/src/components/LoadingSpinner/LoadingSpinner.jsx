import React from "react";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner = ({ size = 200 }) => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.gradientSpinner} style={{ width: size, height: size }} />
    </div>
  );
};

export default LoadingSpinner;


