"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface PixelStreamProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

function PixelStream({ startX, startY, endX, endY }: PixelStreamProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match container
        const resizeCanvas = () => {
            canvas.width = endX - startX;
            canvas.height = 100;
        };
        resizeCanvas();

        // Line properties with curved paths
        const lines: Array<{
            x: number;
            y: number;
            speed: number;
            color: string;
            curve: number;
            curveSpeed: number;
            curveAmplitude: number;
            size: number;
        }> = [];

        // Create initial lines
        const numLines = 50;
        for (let i = 0; i < numLines; i++) {
            const opacity = 0.6 + Math.random() * 0.4;

            // Generate colors from the same spectrum as neon-background
            const colors = [
                `rgba(99, 102, 241, ${opacity})`,  // indigo
                `rgba(236, 72, 153, ${opacity})`,  // pink
                `rgba(244, 114, 182, ${opacity})`, // light pink
                `rgba(192, 132, 252, ${opacity})`, // purple
                `rgba(167, 139, 250, ${opacity})`, // violet
            ];

            // Balanced distribution with minimal pink bias
            const colorIndex = Math.random() < 0.25
                ? (Math.random() < 0.6 ? 1 : 2)  // 15% chance for pink, 10% for light pink
                : Math.floor(Math.random() * colors.length);
            const color = colors[colorIndex];

            // Calculate starting position relative to the modality word
            const verticalOffset = (i - numLines / 2) * 2;
            lines.push({
                x: startX,
                y: startY + verticalOffset,
                speed: 0.5 + Math.random() * 0.5,
                color: color,
                curve: Math.random() * Math.PI * 2,
                curveSpeed: 0.005 + Math.random() * 0.005, // Increased speed for shorter wavelength
                curveAmplitude: 0.1 + Math.random() * 0.2, // Reduced amplitude for flatter waves
                size: 2 + Math.random() * 2,
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);

                // Update curve
                line.curve += line.curveSpeed;

                // Calculate curved movement
                const curveOffset = Math.sin(line.curve) * line.curveAmplitude;
                const isTopHalf = line.y < startY;
                const progress = (line.x - startX) / (endX - startX);

                // Create very subtle hourglass curves
                const hourglassCurve = isTopHalf
                    ? -Math.sin(progress * Math.PI) * 0.001 * (1 - progress)  // Very subtle convex curve for top lines
                    : Math.sin(progress * Math.PI) * 0.001 * progress;  // Very subtle concave curve for bottom lines

                // Update position with curved trajectory
                line.x += line.speed;
                line.y += hourglassCurve + curveOffset;

                // Draw line
                ctx.lineTo(line.x, line.y);
                ctx.strokeStyle = line.color;
                ctx.lineWidth = line.size;
                ctx.stroke();

                // Reset position when reaching the end
                if (line.x > endX) {
                    line.x = startX;
                    line.y = startY + (Math.random() - 0.5) * 1; // Reduced random offset for tighter grouping
                    line.curve = Math.random() * Math.PI * 2;
                    line.curveAmplitude = 0.1 + Math.random() * 0.1;
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            // Cleanup
        };
    }, [startX, startY, endX, endY]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
                width: endX - startX,
                height: 60, // Reduced height to match canvas
                opacity: 0.8
            }}
        />
    );
}

interface AccessibilityPair {
    modality: string;
    audience: string;
}

interface AccessibilityDisplayProps {
    pairs: AccessibilityPair[];
}

export default function AccessibilityDisplay({ pairs }: AccessibilityDisplayProps) {
    const [modalityIndex, setModalityIndex] = useState(0);
    const [audienceIndex, setAudienceIndex] = useState(0);
    const [isChangingModality, setIsChangingModality] = useState(true);

    // Extract unique modalities and audiences from pairs
    const modalities = Array.from(new Set(pairs.map(pair => pair.modality)));
    const audiences = Array.from(new Set(pairs.map(pair => pair.audience)));

    // Create a map of valid combinations
    const validCombinations = new Map<string, Set<string>>();
    pairs.forEach(pair => {
        if (!validCombinations.has(pair.modality)) {
            validCombinations.set(pair.modality, new Set());
        }
        validCombinations.get(pair.modality)?.add(pair.audience);
    });

    useEffect(() => {
        const changeInterval = 3000;

        const cycle = () => {
            if (isChangingModality) {
                setModalityIndex((modalityIndex + 1) % modalities.length);
                setIsChangingModality(false);
            } else {
                const currentModality = modalities[modalityIndex];
                const validAudiences = validCombinations.get(currentModality);
                if (validAudiences) {
                    const currentAudience = audiences[audienceIndex];
                    const validAudienceArray = Array.from(validAudiences);
                    const currentAudienceIndex = validAudienceArray.indexOf(currentAudience);
                    const nextIndex = (currentAudienceIndex + 1) % validAudienceArray.length;
                    const nextAudience = validAudienceArray[nextIndex];
                    setAudienceIndex(audiences.indexOf(nextAudience));
                    setIsChangingModality(true);
                }
            }
        };

        const interval = setInterval(cycle, changeInterval);
        return () => clearInterval(interval);
    }, [modalities.length, audiences.length, modalityIndex, audienceIndex, validCombinations, isChangingModality]);

    return (
        <div className="flex items-center justify-center relative">
            {/* Pixel stream */}
            <PixelStream
                startX={-20}  // Adjusted to start at modality word
                startY={50}    // Centered vertically with the text
                endX={340}     // End at right edge of container
                endY={50}      // Keep same vertical position
            />

            {/* Modality display */}
            <div className="relative w-64 h-16 z-10">
                <div className="absolute inset-0 flex items-center justify-end pr-4">
                    <span className="text-xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                        {modalities[modalityIndex]}
                    </span>
                </div>
            </div>

            {/* "to" text */}
            <div className="relative w-16 h-16 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                        to
                    </span>
                </div>
            </div>

            {/* Audience display */}
            <div className="relative w-64 h-16 z-10">
                <div className="absolute inset-0 flex items-center justify-start pl-4">
                    <span className="text-xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                        {audiences[audienceIndex]}
                    </span>
                </div>
            </div>
        </div>
    );
} 