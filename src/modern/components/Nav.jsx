import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";
import avatar from "../../assets/shrirang-avatar.jpeg";

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
  const navigate = useNavigate();

  // Open the site assistant. Lives in the home page's section 06, so on
  // any other route we navigate there and rely on the global ScrollToHash
  // in Layout to bring the chat into view.
  const goToChat = useCallback(() => {
    setOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById("chat");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/#chat");
    }
  }, [location.pathname, navigate]);

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
          <img
            src={avatar}
            alt=""
            className={styles.brandAvatar}
            width="36"
            height="36"
            loading="eager"
            decoding="async"
          />
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
          <button
            type="button"
            className={styles.chatBtn}
            onClick={goToChat}
            title="Ask the site assistant"
            aria-label="Open site assistant"
          >
            <svg
              className={styles.chatIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className={styles.chatBtnLabel}>Ask</span>
          </button>
          <NavLink
            to="/tinygpt"
            className={({ isActive }) =>
              `${styles.promoLink} ${isActive ? styles.promoLinkActive : ""}`
            }
            title="An LLM I trained, running in your browser"
          >
            <span className={styles.promoLabel}>TinyGPT</span>
            <span className={styles.promoArrow} aria-hidden="true">
              ›
            </span>
          </NavLink>
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
