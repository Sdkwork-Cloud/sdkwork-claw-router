import type { MessagingChannel } from "../../sdkwork-messaging-contracts/src/index";
import {
  assertMessagingAppSdkClient,
  assertMessagingBackendSdkClient,
  type MessagingAppSdkClient,
  type MessagingBackendSdkClient,
} from "../../sdkwork-messaging-sdk-ports/src/index";
import { createSdkworkMessagingService, type SdkworkMessagingService } from "../../sdkwork-messaging-service/src/index";

export interface MessagingRuntimeConfig {
  appId: string;
  enabledChannels: readonly MessagingChannel[];
  environment: "development" | "test" | "staging" | "production";
}

export interface MessagingRuntime {
  config: MessagingRuntimeConfig;
  service: SdkworkMessagingService;
}

export interface CreateMessagingRuntimeInput {
  clients: {
    app: MessagingAppSdkClient;
    backend?: MessagingBackendSdkClient;
  };
  config: MessagingRuntimeConfig;
}

export function createMessagingRuntime(input: CreateMessagingRuntimeInput): MessagingRuntime {
  assertMessagingAppSdkClient(input.clients.app);
  if (input.clients.backend) {
    assertMessagingBackendSdkClient(input.clients.backend);
  }
  return {
    config: { ...input.config },
    service: createSdkworkMessagingService({
      appClient: input.clients.app,
      backendClient: input.clients.backend,
    }),
  };
}

export type { MessagingAppSdkClient, MessagingBackendSdkClient, SdkworkMessagingService };
