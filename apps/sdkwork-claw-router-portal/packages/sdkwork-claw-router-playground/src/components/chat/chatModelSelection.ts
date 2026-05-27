import type { PlaygroundModelGroup, PlaygroundModelOption } from '../../playgroundTypes';

export interface ChatInputModelSelection {
  displayModel: PlaygroundModelOption | null;
  selectedModel: PlaygroundModelOption | null;
  submitModel: PlaygroundModelOption | null;
}

export function isCallableChatModel(model: PlaygroundModelOption): boolean {
  return model.supportsStreaming && model.providerCodes.length > 0;
}

export function findChatModel(groups: PlaygroundModelGroup[], modelId: string): PlaygroundModelOption | null {
  const normalizedModelId = modelId.trim();
  if (!normalizedModelId) {
    return null;
  }
  for (const group of groups) {
    const model = group.llms.find((item) => item.id === normalizedModelId);
    if (model) {
      return model;
    }
  }
  return null;
}

export function findCallableChatModel(groups: PlaygroundModelGroup[], modelId: string): PlaygroundModelOption | null {
  const model = findChatModel(groups, modelId);
  return model && isCallableChatModel(model) ? model : null;
}

export function firstCallableChatModel(groups: PlaygroundModelGroup[]): PlaygroundModelOption | null {
  for (const group of groups) {
    const model = group.llms.find(isCallableChatModel);
    if (model) {
      return model;
    }
  }
  return null;
}

export function resolveChatInputModelSelection(
  groups: PlaygroundModelGroup[],
  selectedModelId: string,
): ChatInputModelSelection {
  const selectedModel = findChatModel(groups, selectedModelId);
  const fallbackCallableModel = firstCallableChatModel(groups);
  const displayModel = selectedModel || fallbackCallableModel;
  let submitModel = fallbackCallableModel;
  if (selectedModel) {
    submitModel = isCallableChatModel(selectedModel) ? selectedModel : null;
  }

  return {
    displayModel,
    selectedModel,
    submitModel,
  };
}
