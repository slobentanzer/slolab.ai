import { THEME_COLORS } from "../constants/theme";
import { HexPixel, GradientDirection } from "../types/hex";

interface HexPixel {
    id: number;
    x: number;
    y: number;
    color: string;
    matchingValue?: number;
}

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
            return normalizedX;
    }
};

const generateColor = (progress: number) => {
    // Define gradient colors
    const startColor = { r: 79, g: 70, b: 229 }; // indigo
    const endColor = { r: 236, g: 72, b: 153 }; // pink

    // Interpolate between colors
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);

    // Return rgba color with some transparency
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

export const colorizeCoordinates = (
    pixels: HexPixel[],
    scale: number = 1.2,
    direction: GradientDirection = 'bottom-left-to-top-right'
): HexPixel[] => {
    const minX = Math.min(...pixels.map(p => p.x));
    const maxX = Math.max(...pixels.map(p => p.x));
    const minY = Math.min(...pixels.map(p => p.y));
    const maxY = Math.max(...pixels.map(p => p.y));

    const pixelsWithProgress = pixels.map(pixel => {
        const normalizedX = (pixel.x - minX) / (maxX - minX);
        const normalizedY = (pixel.y - minY) / (maxY - minY);
        const progress = calculateProgress(normalizedX, normalizedY, direction);

        return {
            ...pixel,
            progress,
        };
    });

    const sortedPixels = [...pixelsWithProgress].sort((a, b) => a.progress - b.progress);
    const totalPixels = sortedPixels.length;

    return sortedPixels.map((pixel, index) => {
        const normalizedIndex = index / (totalPixels - 1);
        return {
            ...pixel,
            x: pixel.x * scale,
            y: pixel.y * scale,
            color: generateColor(pixel.progress),
            matchingValue: normalizedIndex
        };
    });
}; 