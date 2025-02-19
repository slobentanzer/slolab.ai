import { searchDiscovery } from './search-discovery';
import { knowledgeGraph } from './knowledge-graph';
import { conversationalAi } from './conversational-ai';
import { deepLearning } from './deep-learning';
import { people } from './people';

export const hexCoordinates = {
    searchDiscovery,
    knowledgeGraph,
    conversationalAi,
    deepLearning,
    people
} as const;

export type HexImageKey = keyof typeof hexCoordinates; 