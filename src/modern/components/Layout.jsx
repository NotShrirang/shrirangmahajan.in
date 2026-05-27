import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import styles from "./Layout.module.css";

function ScrollHandler() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Defer one tick so the destination has mounted before we measure it.
      const id = hash.slice(1);
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };
      // Try immediately, then once more on the next animation frame in
      // case the page is still rendering its sections.
      if (!tryScroll()) {
        requestAnimationFrame(() => {
          if (!tryScroll()) setTimeout(tryScroll, 120);
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);
  return null;
}

export default function ModernLayout() {
  return (
    <div className={styles.shell}>
      <ScrollHandler />
      <Nav />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
