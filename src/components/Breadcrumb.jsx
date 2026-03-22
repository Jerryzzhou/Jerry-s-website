import React from "react";
import { Link } from "react-router-dom";

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
  return (
    <div className="fixed top-[80px] left-4 md:left-8 z-[9000] flex items-center">
      <div className="px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-full flex items-center font-['HYPixel'] text-[15px] tracking-widest text-[#111] transition-all">
        {segments.map((seg, idx) => (
          <React.Fragment key={idx}>
            {seg.path ? (
              <Link to={seg.path} className="hover:opacity-50 transition-opacity">
                {seg.name}
              </Link>
            ) : (
              <span className="opacity-60">{seg.name}</span>
            )}
            {idx < segments.length - 1 && <span className="mx-3 opacity-40 text-xs mt-[2px]">&gt;&gt;</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
