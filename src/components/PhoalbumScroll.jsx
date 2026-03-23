import React from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getAssetPath } from "../utils/paths";
import "./PhoalbumScroll.css";

const CITY_CONFIG = {
  'introduce': { folder: '01prologue', start: 0, end: 9, hasCover: true, prefix: '', narrative: `有想要做一本摄影集的想法很久了，但是总是陷于其他各种各样乱七八糟杂七杂八一二三四五六七的事情导致没有做成，本质上我是一个特别拖延的人，虽然我还是ENTJ，脑子里有好多好多好有意思的想法（自认为的）都还没有做，你看，不知不觉这就拖到了毕业，所以这回哪怕上刀山下火海也要做完！！！！！！！！\n做这本摄影集的初衷其实是我不知道从哪一刻起开始丧失了快乐，在生活中会莫名变得一本正经，而且似乎随着长大，对生活的感知力却在逐渐下降…，而摄影则是让我挖掘快乐、并感知生活方式（当然还有画画），因此急切的想要我的所见所闻、我的快乐、我的小小的感悟能以实体的形式展展现，时刻提醒我Be Happy，Do Not Worry~。\n大学四年一晃而过，我真正开始习惯于记录也正是自我上本科之时，而我在前段时间回顾照片时，惊异发现已经对大一的自己产生了陌生感，但是不应该啊，印象中我只会对小时候的自己产生陌生感，可能是小时候的自己并没有过多的自我意识，但这四年可是我自己一步一步自己走过来的，那现在怎么会…这么说难道我要做一本陌生人的“摄影集”？！“我”是谁？“我”又变成了谁？\n于是在这本摄影集制作的过程中我开始干了一件和这四年的我所做的一样的事情——“找自己”` },
  'beijing': { folder: '02beijing', start: 10, end: 63, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'wuxi': { folder: '03无锡', start: 64, end: 79, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'suzhou': { folder: '04苏州', start: 80, end: 101, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'hangzhou': { folder: '05杭州', start: 102, end: 113, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'shanghai': { folder: '06上海', start: 114, end: 131, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'wuhan': { folder: '07武汉', start: 132, end: 179, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'shennongjia': { folder: '08神农架', start: 180, end: 199, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'busan': { folder: '09釜山', start: 200, end: 241, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'singapore': { folder: '10新加坡', start: 242, end: 271, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'huzhou': { folder: '11湖州', start: 272, end: 281, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'japan': { folder: '12日本', start: 282, end: 385, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'gansu': { folder: '13甘肃', start: 386, end: 455, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'jingdezhen': { folder: '14景德镇', start: 456, end: 473, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'changshu': { folder: '15常熟', start: 474, end: 483, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'xiamen': { folder: '16厦门', start: 484, end: 505, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'yunnan': { folder: '17云南', start: 506, end: 565, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'chongqing': { folder: '18重庆', start: 566, end: 583, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'nanjing': { folder: '19南京', start: 584, end: 795, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'graduation': { folder: '20毕业', start: 796, end: 917, hasCover: false, prefix: 'Jerry-摄影集（不含封面封底终版）_' },
  'sketch': { folder: 'sketch', isCustom: true }
};

const SKETCH_IMAGES = [
  "2022.04.16.JPG", "2022.04.25.JPG", "2022.04.27.JPG", "2022.04.27（2）.JPG",
  "2022.04.29.JPG", "2022.04.29（2）.JPG", "2022.05.20.JPG", "2022.05.31.JPG",
  "2022.06.01.JPG", "2023.08.25.JPG", "2023.08.26.JPG", "2023.08.26(2).JPG",
  "2023.08.26(3).JPG", "2023.08.28.JPG", "2023.09.02.JPG", "2024.11.03.JPG",
  "2025.02.26.JPG", "2025.03.02.JPG", "2025.03.03.JPG", "2025.03.06.JPG",
  "2025.03.06(2).JPG", "2025.04.22.JPG", "2025.04.22(2).JPG", "2025.06.04.JPG",
  "2025.07.12.JPG", "2025.07.12(2).JPG", "2025.07.22.JPG", 
  "CamScanner 2025-7-25 01.23_11.jpg", "2025.11.06.JPG", "2025.11.07.JPG", 
  "2025.11.27.jpg"
];

const generateItems = (cityId, overrideFolder) => {
  if (cityId === 'sketch') {
    const items = [];
    // 插画/素描 跨页展示
    for (let i = 0; i < SKETCH_IMAGES.length; i += 2) {
      items.push({
        type: 'spread',
        left: `/sketch/${SKETCH_IMAGES[i]}`,
        right: SKETCH_IMAGES[i + 1] ? `/sketch/${SKETCH_IMAGES[i + 1]}` : null
      });
    }
    return items;
  }
  if (cityId === 'overview') {
    const orderedCities = [
      'introduce', 'beijing', 'wuxi', 'suzhou', 'hangzhou', 'shanghai', 
      'wuhan', 'shennongjia', 'busan', 'singapore', 'huzhou', 'japan', 
      'gansu', 'jingdezhen', 'changshu', 'xiamen', 'yunnan', 'chongqing', 
      'nanjing', 'graduation'
    ];
    let allItems = [];
    
    orderedCities.forEach(city => {
      const config = CITY_CONFIG[city];
      if (!config) return;
      const { folder, start, end, hasCover, narrative, prefix = 'Jerry-摄影集（不含封面封底终版）_' } = config;
      // 保证武汉的图片能正常显示（使用正确的 hash 文件夹）
      const actualFolder = city === 'wuhan' ? '07wuhan_8e9bbac2a0e9cfab' : folder;
      
      if (hasCover) {
        allItems.push({ type: 'single', src: `/photography/${actualFolder}/${prefix}00.webp` });
        allItems.push({ type: 'single', src: `/photography/${actualFolder}/${prefix}01.webp`, narrative });
        for (let i = 2; i <= end; i += 2) {
          allItems.push({
            type: 'spread',
            left: `/photography/${actualFolder}/${prefix}0${i}.webp`,
            right: `/photography/${actualFolder}/${prefix}0${i + 1}.webp`
          });
        }
      } else {
        for (let i = start; i <= end; i += 2) {
          allItems.push({
            type: 'spread',
            left: `/photography/${actualFolder}/${prefix}${i}.webp`,
            right: `/photography/${actualFolder}/${prefix}${i + 1}.webp`
          });
        }
      }
    });
    return allItems;
  }

  const config = CITY_CONFIG[cityId];
  if (!config) return [];
  
  const { folder, start, end, hasCover, narrative, prefix = 'Jerry-摄影集（不含封面封底终版）_' } = config;
  const actualFolder = overrideFolder || folder;
  const items = [];

  if (hasCover) {
    // 序章：使用指定的前缀（或者无前缀）
    items.push({ type: 'single', src: `/photography/${actualFolder}/${prefix}00.webp` });
    items.push({ type: 'single', src: `/photography/${actualFolder}/${prefix}01.webp`, narrative });
    for (let i = 2; i <= end; i += 2) {
      items.push({
        type: 'spread',
        left: `/photography/${actualFolder}/${prefix}0${i}.webp`,
        right: `/photography/${actualFolder}/${prefix}0${i + 1}.webp`
      });
    }
  } else {
    // 城市章节：使用统一的前缀格式
    for (let i = start; i <= end; i += 2) {
      items.push({
        type: 'spread',
        left: `/photography/${actualFolder}/${prefix}${i}.webp`,
        right: `/photography/${actualFolder}/${prefix}${i + 1}.webp`
      });
    }
  }
  return items;
};

export default function PhoalbumScroll({ cityId, overrideFolder }) {
  const location = useLocation();
  
  // 根据 cityId 选择生成的数据
  const items = generateItems(cityId, overrideFolder);
  
  // 严格检查路径，确保视觉层（阴影、反光）只在详情页出现，不影响城市选择页 (CityPage)
  const isDetailPage = location.pathname.startsWith("/photography/") || 
                         location.pathname.startsWith("/phoalbum/") ||
                         location.pathname.startsWith("/sketch");

  // 使用 Portal 将中缝和反光挂载到 body 下，确保贯穿视口 (对于 Sketch 且由于其特殊布局，我们改用组件内的连续阴影以避免断层)
  const overlay = (isDetailPage && cityId !== 'sketch') ? createPortal(
    <div className={`global-aesthetic-overlay ${cityId}-mode-overlay`}>
      <div className="spine-shadow" />
      <div className="page-gloss" />
    </div>,
    document.body
  ) : null;

  return (
    <div className={`phoalbum-scroll-container ${cityId}-mode`}>
      {overlay}
      <div className="paper-texture" /> 

      <div className="scroll-content">
        {/* Sketch 页面专属：平面的 2x2 全屏 Header (贴合边缘) */}
        {cityId === 'sketch' && (
          <>
            <div className="sketch-flat-header">
              <div className="grid-row">
                <div className="grid-cell"><img src={getAssetPath("/sketch/01.jpg")} alt="01" /></div>
                <div className="grid-cell"><img src={getAssetPath("/sketch/02.jpg")} alt="02" /></div>
              </div>
              <div className="grid-row">
                <div className="grid-cell"><img src={getAssetPath("/sketch/03.jpg")} alt="03" /></div>
                <div className="grid-cell"><img src={getAssetPath("/sketch/04.PNG")} alt="04" /></div>
              </div>
            </div>
            {/* 连续的中缝阴影和光泽（仅针对 Sketch 详情页，解决断层问题） */}
            <div className="continuous-spine-shadow" />
            <div className="continuous-page-gloss" />
          </>
        )}

        <div className="book-territory-relative">

          {items.map((item, index) => (
            <div key={index} className={`album-unit ${item.type} unit-${index} ${item.narrative ? 'has-narrative' : ''}`}>
            {item.narrative && (
              <div className="page-narrative-left">
                {item.narrative.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
            
            <div className="book-spread-container">
              {/* 底下的图片层 */}
              <div className="images-layer">
                {item.type === "spread" ? (
                  <>
                    <div className="page-img left">
                      <img src={getAssetPath(item.left)} alt={`left-${index}`} loading="lazy" />
                    </div>
                    <div className="page-img right">
                      {item.right && <img src={getAssetPath(item.right)} alt={`right-${index}`} loading="lazy" />}
                    </div>
                  </>
                ) : (
                  <div className="page-img single-center">
                    <img src={getAssetPath(item.src)} alt={`single-${index}`} loading="lazy" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* 章节结束标识 - 移入以确保阴影覆盖 */}
        <div className="chapter-end-mark">
          — — This is the end of this chapter — —
        </div>
      </div>
    </div>
  );
}
