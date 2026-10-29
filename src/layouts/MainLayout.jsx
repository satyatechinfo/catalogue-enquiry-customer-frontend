import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import DevFallbackBanner from "../components/home/DevFallbackBanner.jsx";

export default function MainLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const first = useRef(true);

  // Scroll to top on navigation and move focus to the content for keyboard / screen-reader users.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <DevFallbackBanner />
      <Navbar />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
