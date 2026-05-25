import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import styles from "./Nav.module.css";

const links = [
  { to: "/projects", label: "Work" },
  { to: "/blogs", label: "Writing" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
      data-open={open ? "true" : "false"}
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Shrirang Mahajan — home">
          <span className={styles.brandWord}>Shrirang</span>
          <span className={styles.brandWord + " " + styles.brandWordItalic}>
            Mahajan
          </span>
        </Link>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
        </button>

        <nav className={styles.menu}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <span className={styles.divider} aria-hidden="true" />
          <Link
            to="/jupyter"
            className={styles.jupyterLink}
            title="View this site as a Jupyter notebook"
          >
            <span className={styles.jupyterDot} />
            <span>Jupyter mode</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
