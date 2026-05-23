import { describe, expect, it } from "vitest";
import * as iotModule from "../src";

describe("sdkwork-iot-pc-react service", () => {
  it("marks catalog authentication state from runtime session tokens and keeps selected node", async () => {
    const createDefaultSdkworkIotNodes = (iotModule as Record<string, any>).createDefaultSdkworkIotNodes;
    const createSdkworkIotService = (iotModule as Record<string, any>).createSdkworkIotService;

    const nodes = createDefaultSdkworkIotNodes();
    const authenticatedService = createSdkworkIotService({
      getSessionTokens: () => ({
        authToken: " fleet-token ",
      }),
      nodes,
    });

    const authenticatedCatalog = await authenticatedService.getCatalog({
      nodeId: "node-sensor-plant-east",
    });
    expect(authenticatedCatalog.isAuthenticated).toBe(true);
    expect(authenticatedCatalog.selectedNodeId).toBe("node-sensor-plant-east");

    const anonymousService = createSdkworkIotService({
      getSessionTokens: () => ({
        authToken: "   ",
      }),
      nodes,
    });

    expect(
      anonymousService.getEmptyCatalog({
        nodeId: "missing-node",
      }),
    ).toMatchObject({
      isAuthenticated: false,
      selectedNodeId: "node-gateway-shanghai",
      summary: {
        totalNodes: 4,
      },
    });
  });
});
