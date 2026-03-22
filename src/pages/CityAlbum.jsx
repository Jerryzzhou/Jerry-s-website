import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PhoalbumScroll from "../components/PhoalbumScroll";
import Breadcrumb, { CITY_DISPLAY_NAMES } from "../components/Breadcrumb";
import { motion } from "framer-motion";

export default function CityAlbum() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = React.useState("");
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [wuhanFolder, setWuhanFolder] = React.useState(null);

  // 验证用的 Hash (保护原密码)
  const EXPECTED_HASH = "adcbeda4115f9604995dd7e52992693496cdb325b54c14449cf5d74f59c74313";

  async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const handleUnlock = async () => {
    try {
      const loginHash = await digestMessage(password + "_login");
      if (loginHash === EXPECTED_HASH) {
        // 解密真实防盗链文件夹名
        const folderHash = await digestMessage(password + "_folder");
        setWuhanFolder("07wuhan_" + folderHash.substring(0, 16));
        setIsAuthorized(true);
        setError(false);
      } else {
        setError(true);
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleUnlock();
  };

  // 如果是武汉且未授权，显示密码输入界面
  if (cityId === 'wuhan' && !isAuthorized) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[2000] bg-[#f2f2f2] flex items-center justify-center p-4"
      >
        <Breadcrumb segments={[{ name: "City", path: "/gallery?view=overview" }, { name: "CityPage", path: "/gallery?view=book" }, { name: CITY_DISPLAY_NAMES[cityId] || cityId }]} />
        <div className="max-w-md w-full border border-[#111] bg-white/50 backdrop-blur-md p-10 flex flex-col items-center">
          <h2 className="font-['HYPixel'] text-2xl mb-8 text-[#111]">// ACCESS DENIED</h2>
          <p className="font-['DotPixel'] text-sm text-[#545454] mb-10 text-center tracking-tight">
            The Wuhan chapter is currently protected. <br/>
            Please enter the 6-digit access code to proceed.
          </p>
          
          <div className="w-full space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="ENTER PASSCODE..."
              className={`w-full bg-transparent border-b ${error ? 'border-red-500' : 'border-[#111]'} py-2 font-['HYPixel'] text-center focus:outline-none transition-colors text-xl tracking-[0.5em]`}
              autoFocus
            />
            {error && <p className="text-red-500 font-['DotPixel'] text-xs text-center animate-pulse">INVALID PASSCODE. PLEASE TRY AGAIN.</p>}
            
            <button 
              onClick={handleUnlock}
              className="w-full mt-6 py-3 border border-[#111] font-['HYPixel'] hover:bg-[#111] hover:text-[#f2f2f2] transition-all text-sm tracking-widest"
            >
              U N L O C K
            </button>
            
            <button 
              onClick={() => navigate('/gallery')}
              className="w-full py-2 font-['DotPixel'] text-[#888] hover:text-[#111] transition-colors text-xs"
            >
              BACK TO GALLERY
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="city-album-page"
    >
      <Breadcrumb segments={[{ name: "City", path: "/gallery?view=overview" }, { name: "CityPage", path: "/gallery?view=book" }, { name: CITY_DISPLAY_NAMES[cityId] || cityId }]} />
      <PhoalbumScroll cityId={cityId} overrideFolder={cityId === 'wuhan' ? wuhanFolder : null} />
    </motion.div>
  );
}
