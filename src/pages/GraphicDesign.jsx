import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import PhoalbumScroll from "../components/PhoalbumScroll";

export default function GraphicDesign() {
  const breadcrumbSegments = [
    { name: "My Works", path: "/portfolio" },
    { name: "Graphic Design", path: null }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="graphic-design-page"
    >
      <AnimatePresence mode="wait">
        <Breadcrumb key="graphic-design-breadcrumb" segments={breadcrumbSegments} isGlass={true} />
      </AnimatePresence>

      <PhoalbumScroll cityId="graphic-design" />
    </motion.div>
  );
}
