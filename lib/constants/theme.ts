export const THEME_COLORS = {
    primary: {
        roseMagenta: { hex: '#C2185B', rgb: { r: 194, g: 24, b: 91 } },    // Your logo color
        hotPink: { hex: '#DB2777', rgb: { r: 219, g: 39, b: 119 } },       // Bright pink edge
        electricBlue: { hex: '#38BDF8', rgb: { r: 56, g: 189, b: 248 } },  // Bright blue
        iceBlue: { hex: '#EBF8FF', rgb: { r: 235, g: 248, b: 255 } }      // Almost white blue
    },
    gradient: {
        start: '#f8f6f8',   // indigo-50 from your tailwind config
        mid: '#8f6f8f',     // indigo-500 from your tailwind config
        end: '#423442'      // indigo-900 from your tailwind config
    },
    opacity: {
        low: 0.25,
        medium: 0.5,
        high: 0.95,
        neonLine: {
            min: 0.4,
            max: 0.7
        }
    }
};

export const GRADIENT_DIRECTIONS = {
    bottomLeftToTopRight: 'bottom-left-to-top-right',
    topLeftToBottomRight: 'top-left-to-bottom-right',
    leftToRight: 'left-to-right',
    bottomToTop: 'bottom-to-top',
    rightToLeft: 'right-to-left',
    topToBottom: 'top-to-bottom',
    topRightToBottomLeft: 'top-right-to-bottom-left',
    bottomRightToTopLeft: 'bottom-right-to-top-left'
} as const; 