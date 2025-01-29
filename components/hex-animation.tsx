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
    direction: GradientDirection;
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

    // Increase the opacity variation range
    const baseOpacity = 0.35 + (progress * 0.3);
    const randomVariation = 0.25; // Increased from 0.15
    const finalOpacity = baseOpacity + (Math.random() * randomVariation - randomVariation / 2);

    // Add slight color variation
    const colorVariation = 15; // Add some RGB variation
    const r = Math.round(lerp(startColor.r, endColor.r, progress)) +
        (Math.random() * colorVariation - colorVariation / 2);
    const g = Math.round(lerp(startColor.g, endColor.g, progress)) +
        (Math.random() * colorVariation - colorVariation / 2);
    const b = Math.round(lerp(startColor.b, endColor.b, progress)) +
        (Math.random() * colorVariation - colorVariation / 2);

    return `rgba(${Math.max(0, Math.min(255, r))}, 
                 ${Math.max(0, Math.min(255, g))}, 
                 ${Math.max(0, Math.min(255, b))}, 
                 ${Math.max(0.2, Math.min(0.9, finalOpacity))})`;
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

    // First pass: calculate progress values
    const pixelsWithProgress = pixels.map(pixel => {
        const normalizedX = (pixel.x - minX) / (maxX - minX);
        const normalizedY = (pixel.y - minY) / (maxY - minY);
        const progress = calculateProgress(normalizedX, normalizedY, direction);

        return {
            ...pixel,
            progress,
        };
    });

    // Sort by progress and assign indices
    const sortedPixels = [...pixelsWithProgress].sort((a, b) => a.progress - b.progress);
    const totalPixels = sortedPixels.length;

    // Create final pixels with normalized index
    return sortedPixels.map((pixel, index) => {
        const normalizedIndex = index / (totalPixels - 1); // 0 to 1
        return {
            ...pixel,
            x: pixel.x * scale,
            y: pixel.y * scale,
            color: generateColor(pixel.progress),
            matchingValue: normalizedIndex // Use the normalized index for matching
        };
    });
};

const shapes: Shape[] = [
    {
        name: "Search and Discovery",
        description: "Find and explore relevant information",
        link: "/search",
        direction: 'bottom-left-to-top-right',
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
        direction: 'left-to-right',
        pixels: () => Promise.resolve(colorizeCoordinates(
            hexCoordinates.knowledgeGraph,
            1.2,
            'top-right-to-bottom-left'
        ))
    },
    {
        name: "Conversational AI",
        description: "Natural language understanding and generation",
        link: "/chat",
        direction: 'top-left-to-bottom-right',
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
        direction: 'top-to-bottom',
        pixels: () => Promise.resolve(colorizeCoordinates(
            hexCoordinates.deepLearning,
            1.2,
            'left-to-right'
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
            const shapeIndex = Math.min(Math.floor(progress * shapes.length), shapes.length - 1);
            const nextShapeIndex = Math.min(shapeIndex + 1, shapes.length - 1);

            const currentShapePixels = typeof shapes[shapeIndex].pixels === 'function'
                ? await shapes[shapeIndex].pixels()
                : shapes[shapeIndex].pixels;

            const nextShapePixels = typeof shapes[nextShapeIndex].pixels === 'function'
                ? await shapes[nextShapeIndex].pixels()
                : shapes[nextShapeIndex].pixels;

            const localProgress = (progress * shapes.length) % 1;

            const availableNextPixels = [...nextShapePixels];
            const interpolatedPixels = currentShapePixels.map(currentPixel => {
                if (availableNextPixels.length === 0) {
                    return currentPixel;
                }

                let bestMatchIndex = 0;
                let bestMatchDiff = Math.abs(
                    availableNextPixels[0].matchingValue -
                    currentPixel.matchingValue
                );

                for (let i = 1; i < availableNextPixels.length; i++) {
                    const diff = Math.abs(
                        availableNextPixels[i].matchingValue -
                        currentPixel.matchingValue
                    );
                    if (diff < bestMatchDiff) {
                        bestMatchDiff = diff;
                        bestMatchIndex = i;
                    }
                }

                const nextPixel = availableNextPixels.splice(bestMatchIndex, 1)[0];

                return {
                    id: currentPixel.id,
                    x: lerp(currentPixel.x, nextPixel.x, localProgress),
                    y: lerp(currentPixel.y, nextPixel.y, localProgress),
                    color: currentPixel.color
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