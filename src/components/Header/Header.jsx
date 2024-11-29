import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/stories" 
              className={({ isActive }) => 
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Stories
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/meals" 
              className={({ isActive }) => 
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Meals
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

