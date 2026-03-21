import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PhoalbumScroll from "../components/PhoalbumScroll";
import { motion } from "framer-motion";

export default function CityAlbum() {
  const { cityId } = useParams();
  const navigate = useNavigate();

  // 所有的 cityId 现在都由 PhoalbumScroll 根据 CITY_CONFIG 决定内容
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="city-album-page"
    >
      <PhoalbumScroll cityId={cityId} />
    </motion.div>
  );
}
