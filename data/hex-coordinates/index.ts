import { searchDiscovery } from './search-discovery';
import { knowledgeGraph } from './knowledge-graph';
import { conversationalAi } from './conversational-ai';
import { deepLearning } from './deep-learning';

export const hexCoordinates = {
    searchDiscovery,
    knowledgeGraph,
    conversationalAi,
    deepLearning
} as const;

export type HexImageKey = keyof typeof hexCoordinates; 