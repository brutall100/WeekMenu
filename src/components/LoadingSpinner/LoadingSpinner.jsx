import React from "react";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner = ({ loading, size = 200 }) => {
  return (
    <div className={styles.spinnerContainer}>
      {loading && <div className={styles.gradientSpinner} style={{ width: size, height: size }} />}
    </div>
  );
};
// rounded better than square
export default LoadingSpinner;


