"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { hexCoordinates } from "../data/hex-coordinates/index";

interface HexPixel {
    id: number;
    x: number;
    y: number;
    color: string;
}

interface Shape {
    name: string;
    description: string;
    link: string;
    pixels: (() => Promise<HexPixel[]>) | HexPixel[];
}

// Helper function to generate a grid of hex pixels
const generateHexGrid = (startX: number, startY: number, rows: number, cols: number, colorStart: string, colorEnd: string): HexPixel[] => {
    const pixels: HexPixel[] = [];
    let id = 1;
    const hexWidth = 5; // Smaller hexagons (was 20)
    const hexHeight = 4.25; // Adjusted for aspect ratio (was 17)

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = startX + col * hexWidth + (row % 2) * (hexWidth / 2);
            const y = startY + row * (hexHeight * 0.75);

            // Calculate gradient color based on position
            const progress = (row * cols + col) / (rows * cols);
            const opacity = 0.4 + Math.random() * 0.3; // Random opacity between 0.4 and 0.7
            const color = `rgba(${Math.round(lerp(99, 249, progress))}, ${Math.round(lerp(102, 115, progress))}, ${Math.round(lerp(241, 22, progress))}, ${opacity})`;

            pixels.push({
                id: id++,
                x,
                y,
                color,
            });
        }
    }
    return pixels;
};

// Linear interpolation helper
const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
};

const scaleCoordinates = (pixels: HexPixel[], scale: number = 1.2): HexPixel[] => {
    return pixels.map(pixel => ({
        ...pixel,
        x: pixel.x * scale,
        y: pixel.y * scale
    }));
};

const shapes: Shape[] = [
    {
        name: "Search and Discovery",
        description: "Find and explore relevant information",
        link: "/search",
        pixels: () => Promise.resolve(scaleCoordinates(hexCoordinates.searchDiscovery))
    },
    {
        name: "Knowledge Graph",
        description: "Connected information network",
        link: "/graph",
        pixels: generateHexGrid(150, 50, 80, 100, "rgba(99, 102, 241, 0.4)", "rgba(249, 115, 22, 0.4)")
    },
    {
        name: "Conversational AI",
        description: "Natural language understanding and generation",
        link: "/chat",
        pixels: generateHexGrid(200, 100, 85, 85, "rgba(99, 102, 241, 0.4)", "rgba(249, 115, 22, 0.4)")
    },
    {
        name: "Deep Learning",
        description: "Advanced neural network architectures",
        link: "/deep-learning",
        pixels: generateHexGrid(100, 150, 95, 80, "rgba(99, 102, 241, 0.4)", "rgba(249, 115, 22, 0.4)")
    }
];

interface HexAnimationProps {
    currentShape: number;
}

export default function HexAnimation({ currentShape }: HexAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pixels, setPixels] = useState<HexPixel[]>([]);

    useEffect(() => {
        const loadPixels = async () => {
            const currentPixels = typeof shapes[currentShape].pixels === 'function'
                ? await shapes[currentShape].pixels()
                : shapes[currentShape].pixels;
            setPixels(currentPixels);
        };

        loadPixels();
    }, [currentShape]);

    return (
        <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            <div ref={containerRef} className="absolute inset-0 flex items-center justify-center translate-y-[10%]">
                {pixels.map((pixel) => (
                    <motion.div
                        key={pixel.id}
                        className="absolute hex"
                        style={{
                            width: "4px",
                            height: "4px",
                            backgroundColor: pixel.color,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: pixel.x - 200,
                            y: pixel.y - 250,
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            delay: pixel.id * 0.0005,
                            duration: 0.5,
                        }}
                    />
                ))}
            </div>
        </div>
    );
} 