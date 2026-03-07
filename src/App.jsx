import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Videos from "./pages/Videos";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Portfolio from "./pages/Portfolio";

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    // Force immediate scroll reset to prevent "upward shift" logic conflicts
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";
  const isVideosPage = location.pathname === "/videos";

  // We keep track of the last visited path that wasn't an overlay page
  // to keep it as a static background.
  const prevPathRef = React.useRef("/");

  React.useEffect(() => {
    if (!isAboutPage && !isVideosPage) {
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, isAboutPage, isVideosPage]);

  // If we are on an overlay page, we "freeze" the routes to the previous path
  const backgroundLocation = (isAboutPage || isVideosPage) ? { ...location, pathname: prevPathRef.current } : location;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <Routes
          location={backgroundLocation}
          key={backgroundLocation.pathname.startsWith('/gallery') ? '/gallery' : (backgroundLocation.pathname === '/' || backgroundLocation.pathname.startsWith('/ideas') || backgroundLocation.pathname.startsWith('/portfolio')) ? 'landing' : backgroundLocation.pathname}
        >
          <Route path="/" element={<LandingPage />} />
          <Route path="/ideas" element={<LandingPage />} />
          <Route path="/portfolio" element={<LandingPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/portfolio/selected" element={<Portfolio />} />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {isVideosPage && <Videos key="videos-overlay" />}
      </AnimatePresence>

      <AnimatePresence>
        {isAboutPage && <About key="about-overlay" backgroundPath={prevPathRef.current} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}