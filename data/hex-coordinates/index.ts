import { searchDiscovery } from './search-discovery';
import { knowledgeGraph } from './knowledge-graph';

// Compare some sample coordinates
console.log('Sample Search coordinates:',
    searchDiscovery.slice(0, 3).map(p => ({ x: p.x, y: p.y }))
);
console.log('Sample Knowledge coordinates:',
    knowledgeGraph.slice(0, 3).map(p => ({ x: p.x, y: p.y }))
);

export const hexCoordinates = {
    searchDiscovery,
    knowledgeGraph,
} as const;

export type HexImageKey = keyof typeof hexCoordinates; 