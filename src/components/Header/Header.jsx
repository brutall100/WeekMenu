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
              Pradinis
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/categories" 
              className={({ isActive }) => 
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Kategorijos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/stories" 
              className={({ isActive }) => 
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Istorijos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/meals" 
              className={({ isActive }) => 
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Patiekalai
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

