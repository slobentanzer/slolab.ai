export interface HexPixel {
    id: number;
    x: number;
    y: number;
    color: string;
    matchingValue?: number;
}

export type GradientDirection =
    'bottom-left-to-top-right' |
    'top-left-to-bottom-right' |
    'left-to-right' |
    'bottom-to-top' |
    'right-to-left' |
    'top-to-bottom' |
    'top-right-to-bottom-left' |
    'bottom-right-to-top-left';

export interface Shape {
    name: string;
    description: string;
    link: string;
    pixels: (() => Promise<HexPixel[]>) | HexPixel[];
    direction: GradientDirection;
}