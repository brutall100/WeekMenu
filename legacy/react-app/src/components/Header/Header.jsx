import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Savaitės Meniu</div>
      <button className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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


