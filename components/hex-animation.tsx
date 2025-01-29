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

type GradientDirection =
    'bottom-left-to-top-right' |
    'top-left-to-bottom-right' |
    'left-to-right' |
    'bottom-to-top' |
    'right-to-left' |
    'top-to-bottom' |
    'top-right-to-bottom-left' |
    'bottom-right-to-top-left';

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

const generateColor = (progress: number, opacity: number = 0.5) => {
    // You can adjust these RGB values to change the gradient colors
    const startColor = { r: 99, g: 102, b: 241 }; // Indigo
    const endColor = { r: 249, g: 115, b: 22 };   // Orange

    return `rgba(${Math.round(lerp(startColor.r, endColor.r, progress))}, 
                 ${Math.round(lerp(startColor.g, endColor.g, progress))}, 
                 ${Math.round(lerp(startColor.b, endColor.b, progress))}, 
                 ${opacity})`;
};

const calculateProgress = (normalizedX: number, normalizedY: number, direction: GradientDirection): number => {
    switch (direction) {
        case 'bottom-left-to-top-right':
            return (normalizedX + (1 - normalizedY)) / 2;
        case 'top-left-to-bottom-right':
            return (normalizedX + normalizedY) / 2;
        case 'left-to-right':
            return normalizedX;
        case 'right-to-left':
            return 1 - normalizedX;
        case 'bottom-to-top':
            return 1 - normalizedY;
        case 'top-to-bottom':
            return normalizedY;
        case 'top-right-to-bottom-left':
            return ((1 - normalizedX) + normalizedY) / 2;
        case 'bottom-right-to-top-left':
            return ((1 - normalizedX) + (1 - normalizedY)) / 2;
        default:
            return normalizedX; // default to left-to-right
    }
};

const colorizeCoordinates = (
    pixels: HexPixel[],
    scale: number = 1.2,
    direction: GradientDirection = 'bottom-left-to-top-right'
): HexPixel[] => {
    const minX = Math.min(...pixels.map(p => p.x));
    const maxX = Math.max(...pixels.map(p => p.x));
    const minY = Math.min(...pixels.map(p => p.y));
    const maxY = Math.max(...pixels.map(p => p.y));

    return pixels.map(pixel => {
        const normalizedX = (pixel.x - minX) / (maxX - minX);
        const normalizedY = (pixel.y - minY) / (maxY - minY);

        const progress = calculateProgress(normalizedX, normalizedY, direction);

        return {
            ...pixel,
            x: pixel.x * scale,
            y: pixel.y * scale,
            color: generateColor(
                progress,
                0.4 + Math.random() * 0.3
            )
        };
    });
};

const shapes: Shape[] = [
    {
        name: "Search and Discovery",
        description: "Find and explore relevant information",
        link: "/search",
        pixels: () => Promise.resolve(colorizeCoordinates(
            hexCoordinates.searchDiscovery,
            1.2,
            'bottom-left-to-top-right'
        ))
    },
    {
        name: "Knowledge Graph",
        description: "Connected information network",
        link: "/graph",
        pixels: () => Promise.resolve(colorizeCoordinates(
            hexCoordinates.knowledgeGraph,
            1.2,
            'left-to-right'
        ))
    },
    {
        name: "Conversational AI",
        description: "Natural language understanding and generation",
        link: "/chat",
        pixels: () => Promise.resolve(colorizeCoordinates(
            hexCoordinates.conversationalAi,
            1.2,
            'top-left-to-bottom-right'
        ))
    },
    {
        name: "Deep Learning",
        description: "Advanced neural network architectures",
        link: "/deep-learning",
        pixels: () => Promise.resolve(colorizeCoordinates(
            hexCoordinates.deepLearning,
            1.2,
            'top-to-bottom'
        ))
    }
];

interface HexAnimationProps {
    progress: number; // 0-1 value representing scroll progress
}

export default function HexAnimation({ progress }: HexAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPixels, setCurrentPixels] = useState<HexPixel[]>([]);

    useEffect(() => {
        const loadPixels = async () => {
            // Determine which two shapes we're between based on progress
            const shapeIndex = Math.min(Math.floor(progress * shapes.length), shapes.length - 1);
            const nextShapeIndex = Math.min(shapeIndex + 1, shapes.length - 1);

            // Get the two sets of pixels
            const currentShapePixels = typeof shapes[shapeIndex].pixels === 'function'
                ? await shapes[shapeIndex].pixels()
                : shapes[shapeIndex].pixels;

            const nextShapePixels = typeof shapes[nextShapeIndex].pixels === 'function'
                ? await shapes[nextShapeIndex].pixels()
                : shapes[nextShapeIndex].pixels;

            // Calculate local progress between these two shapes
            const localProgress = (progress * shapes.length) % 1;

            // Interpolate between the two shapes
            const interpolatedPixels = currentShapePixels.map((pixel, i) => {
                const nextPixel = nextShapePixels[i] || pixel;
                return {
                    id: pixel.id,
                    x: lerp(pixel.x, nextPixel.x, localProgress),
                    y: lerp(pixel.y, nextPixel.y, localProgress),
                    color: pixel.color // We'll keep the color from the current shape for simplicity
                };
            });

            setCurrentPixels(interpolatedPixels);
        };

        loadPixels();
    }, [progress]);

    return (
        <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            <div ref={containerRef} className="absolute inset-0 flex items-center justify-center translate-y-[10%]">
                {currentPixels.map((pixel) => (
                    <motion.div
                        key={pixel.id}
                        className="absolute hex"
                        style={{
                            width: "5px",
                            height: "5px",
                            backgroundColor: pixel.color,
                            transform: `translate(${pixel.x - 200}px, ${pixel.y - 250}px)`,
                        }}
                        initial={false}
                    />
                ))}
            </div>
        </div>
    );
} 