import { searchDiscovery } from './search-discovery';

export const hexCoordinates = {
    searchDiscovery,
} as const;

export type HexImageKey = keyof typeof hexCoordinates; 