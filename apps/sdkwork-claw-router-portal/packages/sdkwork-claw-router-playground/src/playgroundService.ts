import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  readRequiredApiItems,
} from 'sdkwork-claw-router-commons/runtime';
import { mapGenerationHistoryItems } from './historyMapper.ts';
export type { PlaygroundHistoryItem, PlaygroundMedia } from './playgroundTypes.ts';
import type { PlaygroundHistoryItem } from './playgroundTypes.ts';

export class PlaygroundService {
  static async fetchGenerationHistory(): Promise<PlaygroundHistoryItem[]> {
    const result = await getClawRouterAppSdkClient().playground.fetchGenerationHistory();
    ensurePlusApiSuccess(result, 'Failed to fetch Playground history');
    return mapGenerationHistoryItems(readRequiredApiItems(result, 'Failed to fetch Playground history'));
  }
}
