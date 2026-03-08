import React, { useState, useCallback } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Videos from "./pages/Videos";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Portfolio from "./pages/Portfolio";
import LoadingScreen from "./components/LoadingScreen";

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathnameRef = React.useRef(pathname);

  React.useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Skip scroll reset when going TO or returning FROM overlay pages
    if (pathname === "/about" || pathname === "/videos") return;
    if (prevPathname === "/about" || prevPathname === "/videos") return;

    const isLandingPath = (p) => p === "/" || p.startsWith("/ideas") || p.startsWith("/portfolio") || p === "/phoalbum-section" || p === "/videos-section";

    // Explicitly ALLOW reset if we are coming FROM a sub-path (/ideas, /portfolio) TO the home path (/)
    const isReturningToHomeFromSub = pathname === "/" && (prevPathname.startsWith("/ideas") || prevPathname.startsWith("/portfolio"));

    if (isLandingPath(pathname) && isLandingPath(prevPathname) && !isReturningToHomeFromSub) return;

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
          key={backgroundLocation.pathname.startsWith('/gallery') ? '/gallery' : (backgroundLocation.pathname === '/' || backgroundLocation.pathname.startsWith('/ideas') || backgroundLocation.pathname.startsWith('/portfolio') || backgroundLocation.pathname.startsWith('/phoalbum') || backgroundLocation.pathname.startsWith('/videos')) ? 'landing' : backgroundLocation.pathname}
        >
          <Route path="/" element={<LandingPage />} />
          <Route path="/ideas" element={<LandingPage />} />
          <Route path="/portfolio" element={<LandingPage />} />
          <Route path="/phoalbum-section" element={<LandingPage />} />
          <Route path="/videos-section" element={<LandingPage />} />
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
  // Only show loading screen when starting from the home/root path
  const isHomePath = (() => {
    const hash = window.location.hash;
    return !hash || hash === "#" || hash === "#/" || hash === "#/home";
  })();
  const [isLoading, setIsLoading] = useState(isHomePath);
  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        ) : (
          <React.Fragment key="app">
            <ScrollToTop />
            <Navbar />
            <AnimatedRoutes />
          </React.Fragment>
        )}
      </AnimatePresence>
    </Router>
  );
}