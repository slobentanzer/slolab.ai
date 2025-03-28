"use client";

import { useEffect, useState } from 'react';

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
    const [isModalityFlipping, setIsModalityFlipping] = useState(false);
    const [isAudienceFlipping, setIsAudienceFlipping] = useState(false);
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
        const changeInterval = 3000; // Time between changes
        const flipDuration = 500;    // Duration of flip animation

        const cycle = () => {
            if (isChangingModality) {
                // Change modality
                setIsModalityFlipping(true);
                setTimeout(() => {
                    setModalityIndex((prev) => (prev + 1) % modalities.length);
                    setIsModalityFlipping(false);
                    // Wait a bit before starting the audience change
                    setTimeout(() => {
                        setIsChangingModality(false);
                    }, 100);
                }, flipDuration);
            } else {
                // Change audience
                setIsAudienceFlipping(true);
                setTimeout(() => {
                    const currentModality = modalities[modalityIndex];
                    const validAudiences = validCombinations.get(currentModality);
                    if (validAudiences) {
                        const currentAudience = audiences[audienceIndex];
                        const validAudienceArray = Array.from(validAudiences);
                        const currentAudienceIndex = validAudienceArray.indexOf(currentAudience);
                        const nextAudienceIndex = (currentAudienceIndex + 1) % validAudienceArray.length;
                        setAudienceIndex(audiences.indexOf(validAudienceArray[nextAudienceIndex]));
                    }
                    setIsAudienceFlipping(false);
                    // Wait a bit before starting the modality change
                    setTimeout(() => {
                        setIsChangingModality(true);
                    }, 100);
                }, flipDuration);
            }
        };

        const interval = setInterval(cycle, changeInterval);
        return () => clearInterval(interval);
    }, [modalities.length, audiences.length, modalityIndex, validCombinations, isChangingModality]);

    return (
        <div className="flex items-center justify-center space-x-8">
            {/* Modality display */}
            <div className="relative w-48 h-16">
                <div className={`absolute inset-0 bg-indigo-900/50 rounded-lg flex items-center justify-center transition-transform duration-500 ${isModalityFlipping ? 'rotate-x-180' : ''}`}>
                    <span className="text-xl text-indigo-200">{modalities[modalityIndex]}</span>
                </div>
            </div>

            {/* Accessibility symbol */}
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-full flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-indigo-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                </div>
            </div>

            {/* Audience display */}
            <div className="relative w-48 h-16">
                <div className={`absolute inset-0 bg-indigo-900/50 rounded-lg flex items-center justify-center transition-transform duration-500 ${isAudienceFlipping ? 'rotate-x-180' : ''}`}>
                    <span className="text-xl text-indigo-200">{audiences[audienceIndex]}</span>
                </div>
            </div>
        </div>
    );
} 