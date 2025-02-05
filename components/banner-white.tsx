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

// Modified color generator for white background - using distinct, balanced colors
const generateColor = (progress: number, seed: number) => {
    // Define distinct colors with better distribution - increased saturation
    const colors = {
        startBlue: { r: 0, g: 200, b: 255 },    // Brighter cyan blue
        midBlue: { r: 50, g: 50, b: 255 },      // More saturated royal blue
        midPurple: { r: 225, g: 0, b: 255 },    // Brighter magenta purple
        endPink: { r: 255, g: 20, b: 130 }      // More saturated pink
    };

    // Adjust progress to ensure smoother gradient across all patterns
    const adjustedProgress = Math.pow(progress, 0.85);  // Makes progression more linear

    let r, g, b;
    if (adjustedProgress < 0.3) {  // Wider range for start color
        const localProgress = adjustedProgress / 0.3;
        r = lerp(colors.startBlue.r, colors.midBlue.r, localProgress);
        g = lerp(colors.startBlue.g, colors.midBlue.g, localProgress);
        b = lerp(colors.startBlue.b, colors.midBlue.b, localProgress);
    } else if (adjustedProgress > 0.7) {  // Wider range for end color
        const localProgress = (adjustedProgress - 0.7) / 0.3;
        r = lerp(colors.midPurple.r, colors.endPink.r, localProgress);
        g = lerp(colors.midPurple.g, colors.endPink.g, localProgress);
        b = lerp(colors.midPurple.b, colors.endPink.b, localProgress);
    } else {
        const localProgress = (adjustedProgress - 0.3) / 0.4;  // Compressed middle section
        r = lerp(colors.midBlue.r, colors.midPurple.r, localProgress);
        g = lerp(colors.midBlue.g, colors.midPurple.g, localProgress);
        b = lerp(colors.midBlue.b, colors.midPurple.b, localProgress);
    }

    // Minimal color variation to maintain saturation
    const colorVariation = 2;
    const random1 = seededRandom(seed * 1000);
    const random2 = seededRandom(seed * 2000);
    const random3 = seededRandom(seed * 3000);
    r += (random1 * colorVariation - colorVariation / 2);
    g += (random2 * colorVariation - colorVariation / 2);
    b += (random3 * colorVariation - colorVariation / 2);

    // Strong opacity variation for high visibility
    const baseOpacity = 0.85 + (progress * 0.15);   // Adjusted base opacity
    const randomVariation = 0.8;                     // Much larger random variation
    const finalOpacity = baseOpacity + (seededRandom(seed * 4000) * randomVariation - randomVariation / 2);

    return `rgba(${Math.max(0, Math.min(255, Math.round(r)))}, 
             ${Math.max(0, Math.min(255, Math.round(g)))}, 
             ${Math.max(0, Math.min(255, Math.round(b)))}, 
             ${Math.max(0.1, Math.min(1, finalOpacity))})`;  // Much wider opacity range
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

export default function BannerWhite() {
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
                dl: dlPixels.map(p => {
                    // Ensure progress is strictly based on x-position for dl pattern
                    const minX = Math.min(...dlPixels.map(dp => dp.x));
                    const maxX = Math.max(...dlPixels.map(dp => dp.x));
                    const normalizedProgress = (p.x - minX) / (maxX - minX);

                    return {
                        ...p,
                        x: (p.x * scale) + 1270,
                        y: (p.y * scale) + 200,
                        pattern: 'dl',
                        color: generateColor(normalizedProgress, p.id + 30000)
                    };
                })
            };

            setPixels(adjustedPixels);
        };

        loadPixels();
    }, []);

    return (
        <div className="w-full h-[300px] bg-white">
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