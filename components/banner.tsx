"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hexCoordinates } from "../data/hex-coordinates/index";
import Logo from "./ui/logo";
import { colorizeCoordinates } from "../lib/utils/hex-utils";
import { THEME_COLORS } from "../lib/constants/theme";
import NeonBackground from "./neon-background";

// Create a seeded random number generator for consistent values
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

const generateColor = (progress: number, seed: number) => {
    const { iceBlue, electricBlue, roseMagenta, hotPink } = THEME_COLORS.primary;

    let r, g, b;
    if (progress < 0.15) {
        // Transition from ice blue to electric blue in first 15%
        const localProgress = progress / 0.15;
        r = lerp(iceBlue.rgb.r, electricBlue.rgb.r, localProgress);
        g = lerp(iceBlue.rgb.g, electricBlue.rgb.g, localProgress);
        b = lerp(iceBlue.rgb.b, electricBlue.rgb.b, localProgress);
    } else if (progress > 0.85) {
        // Transition to hot pink in last 15%
        const localProgress = (progress - 0.85) / 0.15;
        r = lerp(roseMagenta.rgb.r, hotPink.rgb.r, localProgress);
        g = lerp(roseMagenta.rgb.g, hotPink.rgb.g, localProgress);
        b = lerp(roseMagenta.rgb.b, hotPink.rgb.b, localProgress);
    } else {
        // Main gradient from electric blue to rose magenta
        const localProgress = (progress - 0.15) / 0.7;
        r = lerp(electricBlue.rgb.r, roseMagenta.rgb.r, localProgress);
        g = lerp(electricBlue.rgb.g, roseMagenta.rgb.g, localProgress);
        b = lerp(electricBlue.rgb.b, roseMagenta.rgb.b, localProgress);
    }

    // Use seeded random for consistent variation
    const colorVariation = 20;
    const random1 = seededRandom(seed * 1000);
    const random2 = seededRandom(seed * 2000);
    const random3 = seededRandom(seed * 3000);
    r += (random1 * colorVariation - colorVariation / 2);
    g += (random2 * colorVariation - colorVariation / 2);
    b += (random3 * colorVariation - colorVariation / 2);

    // Use theme opacity constants
    const baseOpacity = THEME_COLORS.opacity.medium + (progress * 0.2);
    const randomVariation = 0.35;
    const finalOpacity = baseOpacity + (seededRandom(seed * 4000) * randomVariation - randomVariation / 2);

    return `rgba(${Math.max(0, Math.min(255, Math.round(r)))}, 
             ${Math.max(0, Math.min(255, Math.round(g)))}, 
             ${Math.max(0, Math.min(255, Math.round(b)))}, 
             ${Math.max(THEME_COLORS.opacity.low, Math.min(THEME_COLORS.opacity.high, finalOpacity))})`;
};

const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
};

interface Pixel {
    id: number;
    x: number;
    y: number;
    pattern: string;
    color: string;
    progress?: number;
}

interface PixelGroups {
    search: Pixel[];
    graph: Pixel[];
    ai: Pixel[];
    dl: Pixel[];
}

export default function Banner() {
    const [pixels, setPixels] = useState<PixelGroups>({
        search: [],
        graph: [],
        ai: [],
        dl: []
    });

    useEffect(() => {
        const loadPixels = async () => {
            // Increase scale to create more space between pixels
            const scale = 1.2;

            const searchPixels = colorizeCoordinates(hexCoordinates.searchDiscovery, scale, 'bottom-left-to-top-right');
            const graphPixels = colorizeCoordinates(hexCoordinates.knowledgeGraph, scale, 'top-left-to-bottom-right');
            const aiPixels = colorizeCoordinates(hexCoordinates.conversationalAi, scale, 'top-right-to-bottom-left');
            const dlPixels = colorizeCoordinates(hexCoordinates.deepLearning, scale, 'left-to-right');

            const adjustedPixels: PixelGroups = {
                search: searchPixels.map(p => ({
                    ...p,
                    x: (p.x * scale) + 200,
                    y: (p.y * scale) + 200,
                    pattern: 'search',
                    color: generateColor(p.progress || 0.5, p.id)
                })),
                graph: graphPixels.map(p => ({
                    ...p,
                    x: (p.x * scale) + 510,
                    y: (p.y * scale) + 200,
                    pattern: 'graph',
                    color: generateColor(p.progress || 0.5, p.id + 10000)
                })),
                ai: aiPixels.map(p => ({
                    ...p,
                    x: (p.x * scale) + 900,
                    y: (p.y * scale) + 200,
                    pattern: 'ai',
                    color: generateColor(p.progress || 0.5, p.id + 20000)
                })),
                dl: dlPixels.map(p => ({
                    ...p,
                    x: (p.x * scale) + 1270,
                    y: (p.y * scale) + 200,
                    pattern: 'dl',
                    color: generateColor(p.progress || 0.5, p.id + 30000)
                }))
            };

            setPixels(adjustedPixels);
        };

        loadPixels();
    }, []);

    return (
        <div className="w-full h-[300px] bg-black/20">
            <NeonBackground />
            <div className="relative w-full h-full flex justify-center items-center">
                <div className="relative w-full h-full">
                    {[...pixels.search, ...pixels.graph, ...pixels.ai, ...pixels.dl].map((pixel) => (
                        <motion.div
                            key={`${pixel.pattern}-${pixel.id}`}
                            className="absolute hex"
                            style={{
                                width: "5px",
                                height: "5px",
                                backgroundColor: pixel.color,
                                transform: `translate(${pixel.x}px, ${pixel.y}px)`,
                            }}
                            initial={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 