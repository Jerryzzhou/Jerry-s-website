import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export const CITY_DISPLAY_NAMES = {
  'introduce': 'PROLOGUE_序章',
  'beijing': 'BEIJING_北京',
  'wuxi': 'WUXI_无锡',
  'suzhou': 'SUZHOU_苏州',
  'hangzhou': 'HANGZHOU_杭州',
  'shanghai': 'SHANGHAI_上海',
  'wuhan': 'WUHAN_武汉',
  'shennongjia': 'SHENNONGJIA_神农架',
  'busan': 'BUSAN_釜山',
  'singapore': 'SINGAPORE_新加坡',
  'huzhou': 'HUZHOU_湖州',
  'japan': 'JAPAN_日本',
  'gansu': 'GANSU_甘肃',
  'jingdezhen': 'JINGDEZHEN_景德镇',
  'changshu': 'CHANGSHU_常熟',
  'xiamen': 'XIAMEN_厦门',
  'yunnan': 'YUNNAN_云南',
  'chongqing': 'CHONGQING_重庆',
  'nanjing': 'NANJING_南京',
  'graduation': 'GRADUATION_毕业',
  'overview': 'OVERVIEW_总览'
};

export default function Breadcrumb({ segments, isGlass = false }) {
  // top-[57px] aligns securely flush exactly beneath the global navbar
  const content = (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-[67px] left-0 z-[10000] flex items-center w-full"
    >
      <div className={`w-full py-2 rounded-none border-t border-[#111] flex items-center justify-center font-['HYPixel'] text-[12px] tracking-widest text-[#111] transition-all ${isGlass ? 'bg-[#F2F2F2]/0 backdrop-blur-md' : 'bg-[#F2F2F2]/95 backdrop-blur-none'}`}>
        {segments.map((seg, idx) => (
          <React.Fragment key={idx}>
            {seg.path ? (
              <Link to={seg.path} className="hover:opacity-50 transition-opacity">
                {seg.name}
              </Link>
            ) : (
              <span className="opacity-60">{seg.name}</span>
            )}
            {idx < segments.length - 1 && <span className="mx-3 opacity-40 text-[10px] mt-[1px]">-</span>}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );

  return createPortal(content, document.body);
}
