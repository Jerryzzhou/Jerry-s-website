import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { getAssetPath } from '../utils/paths';

/**
 * DoodlePhysics Component - Realistic "Doodle Dump"
 * Uses Matter.js for collisions, gravity, and ground landing.
 */
export default function DoodlePhysics({ isActive }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const renderRef = useRef(null);
    const isSpawnedRef = useRef(false);

    const doodleAssets = [
        "!.png", "$.png", "0.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png",
        "9.png", "_.png", "apple.png", "arrow-1.png", "arrow-2.png", "arrow-3.png", "arrow-4.png",
        "arrow.png", "arrows.png", "bag.png", "bikini cat.png", "bird.png", "book.png",
        "bowling ball.png", "broken heart.png", "bubbles.png", "bypass.png", "cactus.png",
        "candle.png", "cat.png", "champagne.png", "circle.png", "crown.png", "cup of coffe.png",
        "daimond.png", "dog.png", "dotted line.png", "eye.png", "fish skeleton.png",
        "flower-1.png", "flower.png", "frame.png", "ghost.png", "glass.png", "hand.png",
        "hashtag.png", "hearts.png", "house.png", "infinity.png", "key.png", "lemon.png",
        "lemonade.png", "lihtning.png", "line-1.png", "line-2.png", "line-3.png", "line.png",
        "lipstic.png", "melody.png", "moon.png", "mountains.png", "mushroom.png", "no.png",
        "noodles.png", "ok.png", "one.png", "pants.png", "paw.png", "pear.png", "post mark.png",
        "sad smile.png", "skate.png", "smile.png", "smiles.png", "smiling star.png",
        "sparkle.png", "spiral.png", "square.png", "star-1.png", "star.png", "strawberries.png",
        "sun glasses.png", "sun.png", "tears.png", "today.png", "tooth.png", "triangle.png",
        "vampire.png", "yes.png", "€.png"
    ];

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // --- SETUP MATTER.JS ---
        const engine = Matter.Engine.create();
        const world = engine.world;
        engineRef.current = engine;

        // Lighter gravity as requested
        engine.gravity.y = 0.4;

        // Use window dimensions to avoid 0x0 container size on hidden mount
        const getW = () => window.innerWidth;
        const getH = () => window.innerHeight;

        const render = Matter.Render.create({
            canvas: canvasRef.current,
            engine: engine,
            options: {
                width: getW(),
                height: getH(),
                background: 'transparent',
                wireframes: false,
                pixelRatio: window.devicePixelRatio || 1
            }
        });
        renderRef.current = render;

        // Boundaries
        const thickness = 300;
        // Ground exactly at bottom of the canvas
        // We use render.options.height to ensure it's synced with the actual canvas height
        const ground = Matter.Bodies.rectangle(
            render.options.width / 2, render.options.height + thickness / 2 - 5,
            render.options.width * 10, thickness,
            { isStatic: true, render: { visible: false } }
        );
        const leftWall = Matter.Bodies.rectangle(
            -thickness / 2, render.options.height / 2,
            thickness, render.options.height * 5,
            { isStatic: true, render: { visible: false } }
        );
        const rightWall = Matter.Bodies.rectangle(
            render.options.width + thickness / 2, render.options.height / 2,
            thickness, render.options.height * 5,
            { isStatic: true, render: { visible: false } }
        );

        Matter.World.add(world, [ground, leftWall, rightWall]);

        const runner = Matter.Runner.create();
        runnerRef.current = runner;
        Matter.Runner.run(runner, engine);
        Matter.Render.run(render);

        const handleResize = () => {
            if (!containerRef.current) return;
            const newW = getW();
            const newH = getH();
            render.options.width = newW;
            render.options.height = newH;
            render.canvas.width = newW;
            render.canvas.height = newH;
            Matter.Body.setPosition(ground, { x: newW / 2, y: newH + thickness / 2 - 25 });
            Matter.Body.setPosition(leftWall, { x: -thickness / 2, y: newH / 2 });
            Matter.Body.setPosition(rightWall, { x: newW + thickness / 2, y: newH / 2 });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            isSpawnedRef.current = false;
        };
    }, []);

    useEffect(() => {
        let timer;
        if (isActive && !isSpawnedRef.current) {
            timer = setTimeout(() => {
                spawnDoodles();
                isSpawnedRef.current = true;
            }, 2500);
        } else if (!isActive) {
            if (engineRef.current) {
                const bodies = Matter.Composite.allBodies(engineRef.current.world);
                const doodles = bodies.filter(b => !b.isStatic);
                Matter.World.remove(engineRef.current.world, doodles);
                isSpawnedRef.current = false;
            }
        }
        return () => clearTimeout(timer);
    }, [isActive]);

    const spawnDoodles = () => {
        if (!engineRef.current || !containerRef.current) return;

        const width = canvasRef.current.width / (window.devicePixelRatio || 1);
        const bodies = [];
        const count = 60; // 👈 Denser dump

        for (let i = 0; i < count; i++) {
            const asset = doodleAssets[Math.floor(Math.random() * doodleAssets.length)];
            const x = Math.random() * (width - 150) + 75;
            // Spread vertical spawn even more to prevent physics "explosions" from overlap at t=0
            const y = -150 - (i * 45);
            const scale = width > 768 ? 0.42 : 0.28;

            /**
             * MAXIMUM REPULSION (Referencing falling fonts logic):
             * We use a body size that is significantly LARGE (320x300 base)
             * to ensure the visual images (doodles) stay far apart.
             */
            const body = Matter.Bodies.rectangle(x, y, 320 * scale, 300 * scale, {
                restitution: 0.85, // Bouncy repulsion
                friction: 0.2,
                frictionAir: 0.015,
                angle: Math.random() * Math.PI,
                render: {
                    sprite: {
                        texture: getAssetPath(`/doodles/${asset}`),
                        xScale: scale,
                        yScale: scale
                    },
                    opacity: 0.7 // 👈 70% opacity exactly
                }
            });

            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 10,
                y: 5 + Math.random() * 8
            });

            bodies.push(body);
        }

        Matter.World.add(engineRef.current.world, bodies);
    };

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
