import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetPath } from '../utils/paths';

const doodleAssets = [
    "!.png", "smile.png", "star.png", "sun.png", "heart.png", "flower.png",
    "bird.png", "cat.png", "dog.png", "square.png", "triangle.png", "arrows.png"
];

export default function LoadingScreen({ onComplete }) {
    const [dots, setDots] = useState("");
    const [batchKey, setBatchKey] = useState(0);

    // Generate 6 unique doodles for each batch
    const randomDoodles = useMemo(() => {
        const shuffledAssets = [...doodleAssets].sort(() => Math.random() - 0.5);

        const picked = [];
        // WIDER ARC: Spread items from -90 to 90 degrees for maximum horizontal dispersion
        const baseAngles = [-85, -50, -15, 15, 50, 85];
        const shuffledAngles = [...baseAngles].sort(() => Math.random() - 0.5);

        for (let i = 0; i < 6; i++) {
            const angleRad = (shuffledAngles[i] + (Math.random() * 10 - 5)) * (Math.PI / 180);
            // distance controls how far they fly out
            const distance = 70 + Math.random() * 40;

            picked.push({
                id: `${batchKey}-${i}`, // Unique ID per batch ensures fresh animations
                url: shuffledAssets[i],
                x: Math.sin(angleRad) * distance,
                y: -Math.cos(angleRad) * distance,
                delay: i * 0.15,
                scale: 0.05 + Math.random() * 0.08, // AS SET BY USER
                opacity: 0.35 + Math.random() * 0.15
            });
        }
        return picked;
    }, [batchKey]);

    useEffect(() => {
        // Switch batch every 2.8 seconds to see "different elements"
        const interval = setInterval(() => {
            setBatchKey(prev => prev + 1);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 400);

        const timeout = setTimeout(() => {
            onComplete();
        }, 3600);

        return () => {
            clearInterval(dotsInterval);
            clearTimeout(timeout);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F2F2F2] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="relative flex items-center justify-center w-full h-full">
                {/* Looping batches with AnimatePresence */}
                <AnimatePresence mode="popLayout">
                    {randomDoodles.map(doodle => (
                        <motion.img
                            key={doodle.id}
                            src={getAssetPath(`/doodles/${doodle.url}`)}
                            className="absolute mix-blend-multiply pointer-events-none origin-center"
                            style={{ x: 0, y: 0 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, doodle.opacity, doodle.opacity, 0],
                                scale: [0, doodle.scale * 1.3, doodle.scale, doodle.scale],
                                x: [0, doodle.x, doodle.x, doodle.x],
                                y: [0, doodle.y, doodle.y, 800], // Fall through bottom
                                rotate: [0, 15, -10, 45]
                            }}
                            exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
                            transition={{
                                duration: 2.8,
                                delay: doodle.delay,
                                times: [0, 0.25, 0.45, 1],
                                ease: ["easeOut", "linear", "circIn"]
                            }}
                        />
                    ))}
                </AnimatePresence>

                {/* Central Bouncing Avatar */}
                <motion.div
                    className="relative z-10"
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100, duration: 0.8 }}
                >
                    <motion.img
                        src={getAssetPath("/avatar.webp")}
                        alt="Loading Avatar"
                        className="w-24 h-24 md:w-32 md:h-32 object-contain filter grayscale"
                        animate={{
                            y: [0, -18, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    className="absolute mt-36 font-['DotPixel'] text-[#111] text-lg md:text-xl tracking-widest text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    LOADING{dots}
                </motion.div>
            </div>
        </motion.div>
    );
}
