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

    // Create a map of valid modalities for each audience
    const validModalitiesPerAudience = new Map<string, Set<string>>();
    // Create a map of valid audiences for each modality
    const validAudiencesPerModality = new Map<string, Set<string>>();

    pairs.forEach(pair => {
        // Add modality to audience's valid modalities
        if (!validModalitiesPerAudience.has(pair.audience)) {
            validModalitiesPerAudience.set(pair.audience, new Set());
        }
        validModalitiesPerAudience.get(pair.audience)?.add(pair.modality);

        // Add audience to modality's valid audiences
        if (!validAudiencesPerModality.has(pair.modality)) {
            validAudiencesPerModality.set(pair.modality, new Set());
        }
        validAudiencesPerModality.get(pair.modality)?.add(pair.audience);
    });

    useEffect(() => {
        const changeInterval = 3000;

        const cycle = () => {
            const currentModality = modalities[modalityIndex];
            const currentAudience = audiences[audienceIndex];

            if (isChangingModality) {
                // When changing modality, randomly select from valid modalities for current audience
                const validModalities = validModalitiesPerAudience.get(currentAudience);
                if (validModalities) {
                    const validModalityArray = Array.from(validModalities);
                    const otherModalities = validModalityArray.filter(m => m !== currentModality);

                    if (otherModalities.length > 0) {
                        const randomModality = otherModalities[Math.floor(Math.random() * otherModalities.length)];
                        const newModalityIndex = modalities.indexOf(randomModality);
                        setModalityIndex(newModalityIndex);
                        setIsChangingModality(false);
                    }
                }
            } else {
                // When changing audience, randomly select from valid audiences for current modality
                const validAudiences = validAudiencesPerModality.get(currentModality);
                if (validAudiences) {
                    const validAudienceArray = Array.from(validAudiences);
                    const otherAudiences = validAudienceArray.filter(a => a !== currentAudience);

                    if (otherAudiences.length > 0) {
                        const randomAudience = otherAudiences[Math.floor(Math.random() * otherAudiences.length)];
                        const newAudienceIndex = audiences.indexOf(randomAudience);
                        setAudienceIndex(newAudienceIndex);
                        setIsChangingModality(true);
                    }
                }
            }
        };

        const interval = setInterval(cycle, changeInterval);
        return () => clearInterval(interval);
    }, [modalities.length, modalityIndex, audienceIndex, validModalitiesPerAudience, validAudiencesPerModality, isChangingModality]);

    return (
        <div className="flex items-center justify-center relative">
            {/* Pixel stream */}
            <PixelStream
                startX={200}  // Adjusted to start at modality word
                startY={50}    // Centered vertically with the text
                endX={800}     // End at right edge of container
                endY={50}      // Keep same vertical position
            />

            {/* Modality display */}
            <div className="relative w-64 h-16 z-10">
                <div className="absolute inset-0 flex items-center justify-end pr-4">
                    <motion.span
                        key={modalities[modalityIndex]}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400"
                    >
                        {modalities[modalityIndex]}
                    </motion.span>
                </div>
            </div>

            {/* "to" text */}
            <div className="relative w-16 h-16 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="text-xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400"
                    >
                        to
                    </motion.span>
                </div>
            </div>

            {/* Audience display */}
            <div className="relative w-64 h-16 z-10">
                <div className="absolute inset-0 flex items-center justify-start pl-4">
                    <motion.span
                        key={audiences[audienceIndex]}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400"
                    >
                        {audiences[audienceIndex]}
                    </motion.span>
                </div>
            </div>
        </div>
    );
} 