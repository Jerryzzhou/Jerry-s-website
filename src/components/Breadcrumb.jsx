import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

export default function Breadcrumb({ segments }) {
  // top-[64px] aligns securely flush exactly beneath the global navbar
  return (
    <motion.div 
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-[64px] left-0 z-[9000] flex items-center w-full"
    >
      <div className="w-full pl-8 pr-6 py-2 bg-white/40 backdrop-blur-md rounded-none flex items-center font-['HYPixel'] text-[12px] tracking-widest text-[#111] transition-all">
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
}
