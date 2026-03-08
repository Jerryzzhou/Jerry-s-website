import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { getAssetPath } from "../utils/paths";

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null); // Changed to track WHICH submenu item is hovered
  const [activeSection, setActiveSection] = useState(null);
  const [isAboutActive, setIsAboutActive] = useState(false);
  const location = useLocation();

  const navLinks = [
    {
      name: "Phoalbum", path: "/#phoalbum", action: "NAV_PHOALBUM",
      submenus: [
        { name: "City", path: "/gallery?view=overview", state: { openBook: false }, action: null },
        { name: "CityPage", path: "/gallery?view=book", state: { openBook: true }, action: null }
      ]
    },
    {
      name: "Videos", path: "/#videos", action: "NAV_VIDEOS",
      submenus: [
        { name: "Videos Exhibition", path: "/videos", action: null }
      ]
    },
    {
      name: "My Works", path: "/portfolio", action: "NAV_WORKS",
      submenus: [
        { name: "Selected Works", path: "/portfolio/selected" }
      ]
    },
    { name: "Some Idea", path: "/ideas", action: "NAV_IDEA" },
    { name: "About meee^", path: "/about" },
  ];

  // Listen for active section changes from LandingPage
  useEffect(() => {
    const handleSectionChange = (e) => {
      setActiveSection(e.detail);
    };
    window.addEventListener("activeSectionChanged", handleSectionChange);

    // Listen for About page overlay status
    const handleAboutPageChange = (e) => {
      setIsAboutActive(e.detail.isActive);
    };
    window.addEventListener("aboutPageStateChange", handleAboutPageChange);

    return () => {
      window.removeEventListener("activeSectionChanged", handleSectionChange);
      window.removeEventListener("aboutPageStateChange", handleAboutPageChange);
    };
  }, []);

  // Clear active section when moving completely away from the portfolio realm
  useEffect(() => {
    const isLandingPagePath = location.pathname === '/' ||
      location.pathname === '/portfolio' ||
      location.pathname === '/ideas' ||
      location.pathname.startsWith('/portfolio/') ||
      location.pathname.startsWith('/phoalbum') ||
      location.pathname.startsWith('/videos');

    if (!isLandingPagePath) {
      setActiveSection(null);
    }
  }, [location.pathname]);

  const isDark = activeSection === "Videos" || isAboutActive || location.pathname === "/videos";
  const isGlass = activeSection === "My Works" || activeSection === "Some Idea";

  // Calculate the single "winning" active name to prevent double-line bug
  const currentActiveName = useMemo(() => {
    const path = location.pathname;

    // Level 1: Precise sync signal from LandingPage (Home/Portfolio/Ideas scroll)
    // If LandingPage is sending a signal, it is the ABSOLUTE TRUTH.
    // If signal is "Home", we return null (no underline for hero section).
    if (activeSection) {
      if (activeSection === "Home") return null;
      return activeSection;
    }

    // Level 2: Dedicated sub-pages (not managed by LandingPage scroll)
    if (path === "/about") return "About meee^";
    if (path === "/videos" || path.startsWith("/videos")) return "Videos";
    if (path.startsWith("/gallery")) return "Phoalbum";

    // Level 3: Initial Route fallback (before LandingPage triggers or sends signal)
    if (path.startsWith("/portfolio")) return "My Works";
    if (path.startsWith("/ideas")) return "Some Idea";

    return null;
  }, [location.pathname, activeSection]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[10001] py-4 px-8 flex justify-between items-center transition-colors duration-300 ${isDark
      ? "bg-[#222222]"
      : isGlass
        ? "bg-transparent backdrop-blur-md border-b border-transparent"
        : "bg-[#F2F2F2]/95 border-b border-transparent"
      }`}>
      {/* Left: Brand/Title with Avatar and Navigation Links */}
      <div className="flex items-center gap-8">
        {/* Brand with Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <img
              src={getAssetPath("/avatar.webp")}
              alt="icon"
              className={`absolute top-1/2 left-[-25px] -translate-y-1/2 w-14 h-14 max-w-none object-contain transition-all ${isDark ? "invert" : ""}`}
            />
          </div>
          <Link
            to="/"
            onClick={() => window.dispatchEvent(new CustomEvent("resetHome"))}
            className={`font-['HYPixel'] hover:opacity-70 transition-all ${isDark ? "text-white" : "text-[#000000]"}`}
            style={{ fontSize: '18.74px' }}
          >
            Jerry'z Inspiration Archive
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`hidden md:flex items-center space-x-1 font-['HYPixel'] transition-colors ${isDark ? "text-white" : "text-[#000000]"}`} style={{ fontSize: '18.74px' }}>
          {navLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <div
                className="relative flex items-center"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => {
                  setHoveredLink(null);
                  setHoveredSubmenu(null);
                }}
              >
                <Link
                  to={link.path}
                  onClick={(e) => {
                    if (link.action) {
                      const isLandingPagePath = location.pathname === '/' ||
                        location.pathname === '/portfolio' ||
                        location.pathname === '/ideas' ||
                        location.pathname.startsWith('/portfolio/');

                      if (!isLandingPagePath) {
                        // Coming from external route (Gallery etc.) — reset and give LandingPage
                        // extra time to mount before dispatching the navAction
                        window.dispatchEvent(new CustomEvent("resetHome"));
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent("navAction", { detail: link.action }));
                        }, 300); // Longer delay — LandingPage needs to mount first
                      } else {
                        // Already on LandingPage — fire immediately
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent("navAction", { detail: link.action }));
                        }, 50);
                      }
                    }
                  }}
                  className={`px-2 py-[2px] transition-all duration-75 block ${hoveredLink === link.name
                    ? (isDark ? 'border border-white' : 'border border-black')
                    : 'border border-transparent'
                    }`}
                >
                  {link.name}
                </Link>

                {/* Dynamic Underline Indicator */}
                {currentActiveName === link.name && (
                  <motion.div
                    key={link.name}
                    className={`absolute bottom-[-1px] left-0 w-full h-[2px] ${isDark ? "bg-white" : "bg-black"}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    style={{ originX: 0.5 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}

                {/* Dynamic Submenus */}
                {link.submenus && hoveredLink === link.name && (
                  <div className="absolute top-[calc(100%-1px)] left-0 z-50 flex flex-col">
                    {link.submenus.map((sub, sIdx) => {
                      const isThisSubHovered = hoveredSubmenu === sub.name;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          state={sub.state}
                          onClick={(e) => {
                            if (sub.action) {
                              if (location.pathname !== '/') {
                                window.dispatchEvent(new CustomEvent("resetHome"));
                              }
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent("navAction", { detail: sub.action }));
                              }, 50);
                            }
                          }}
                          onMouseEnter={() => setHoveredSubmenu(sub.name)}
                          onMouseLeave={() => setHoveredSubmenu(null)}
                          className={`block px-2 py-[2px] border min-w-max transition-colors duration-75 flex items-center justify-between gap-2 ${isDark
                            ? (isThisSubHovered ? 'bg-white text-black border-white' : 'bg-[#111] text-white border-white')
                            : (isThisSubHovered ? 'bg-black text-white border-black' : 'bg-[#F2F2F2] text-black border-black')
                            }`}
                          style={{ marginTop: sIdx > 0 ? '-1px' : '-1px' }}
                        >
                          <span className="whitespace-nowrap">{sub.name}</span>
                          <img
                            src={getAssetPath("/icons/vector-arrow.svg")}
                            alt=""
                            className={`w-3 h-3 transition-transform duration-200 ${isThisSubHovered ? 'rotate-0' : '-rotate-90'} ${(isThisSubHovered && !isDark) || (!isThisSubHovered && isDark) ? 'invert' : ''
                              }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              {index < navLinks.length - 1 && <span className="px-1">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Contact */}
      <div>
        <a href="mailto:3134499362@qq.com" className={`font-['HYPixel'] hover:opacity-70 transition-all ${isDark ? "text-white" : "text-[#000000]"}`} style={{ fontSize: '18.74px' }}>
          Contact
        </a>
      </div>
    </nav>
  );
}