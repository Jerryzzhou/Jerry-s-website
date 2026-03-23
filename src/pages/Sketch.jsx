import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import PhoalbumScroll from "../components/PhoalbumScroll";
import "./Sketch.css";

export default function Sketch() {
  const breadcrumbSegments = [
    { name: "My Works", path: "/portfolio" },
    { name: "Illustration / Sketch", path: null }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sketch-page"
    >
      <AnimatePresence mode="wait">
        <Breadcrumb key="sketch-breadcrumb" segments={breadcrumbSegments} isGlass={true} />
      </AnimatePresence>

      <PhoalbumScroll cityId="sketch" />
    </motion.div>
  );
}
