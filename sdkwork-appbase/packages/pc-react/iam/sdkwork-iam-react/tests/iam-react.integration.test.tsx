import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  IamRuntimeProvider,
  createMemoryIamTokenStore,
  useIamRuntime,
  useIamService,
} from "../src/index";

describe("@sdkwork/iam-react integration", () => {
  it("creates and provides an IAM runtime from generated SDK clients for fast app integration", async () => {
    const tokenStore = createMemoryIamTokenStore();

    render(
      <IamRuntimeProvider
        clients={{
          app: createStandardAppClient(),
          backend: {
            iam: createStandardBackendIamClient(),
          },
        }}
        config={{
          appId: "sdkwork-router",
          deploymentMode: "saas",
          environment: "test",
        }}
        tokenStore={tokenStore}
      >
        <Probe />
      </IamRuntimeProvider>,
    );

    expect(screen.getByTestId("deployment-mode")).toHaveTextContent("saas");
    expect(screen.getByTestId("has-service")).toHaveTextContent("yes");
  });
});

function Probe() {
  const runtime = useIamRuntime();
  const service = useIamService();

  return (
    <>
      <div data-testid="deployment-mode">{runtime.config.deploymentMode}</div>
      <div data-testid="has-service">{service ? "yes" : "no"}</div>
    </>
  );
}

function createStandardAppClient() {
  return {
    auth: {
      oauthAuthorizationUrls: {
        retrieve: vi.fn(),
      },
      oauthSessions: {
        create: vi.fn(),
      },
      passwordResetRequests: {
        create: vi.fn(),
      },
      passwordResets: {
        create: vi.fn(),
      },
      registrations: {
        create: vi.fn(),
      },
      verificationPolicy: {
        retrieve: vi.fn(),
      },
      sessions: {
        create: vi.fn(),
        current: {
          delete: vi.fn(),
          retrieve: vi.fn(),
          update: vi.fn(),
        },
        refresh: vi.fn(),
      },
      verificationCodes: {
        create: vi.fn(),
        verify: vi.fn(),
      },
    },
    iam: {
      users: {
        current: {
          retrieve: vi.fn(),
        },
      },
    },
  };
}

function createStandardBackendIamClient() {
  return {
    apiKeys: {
      list: vi.fn(),
      revoke: vi.fn(),
    },
    auditEvents: {
      list: vi.fn(),
    },
    organizations: {
      create: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      retrieve: vi.fn(),
      tree: {
        retrieve: vi.fn(),
      },
      update: vi.fn(),
      members: {
        create: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
      },
    },
    permissions: {
      create: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
    },
    policies: {
      create: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
    },
    roles: {
      create: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      permissions: {
        create: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
      },
    },
    securityEvents: {
      list: vi.fn(),
    },
    tenants: {
      create: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      members: {
        create: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
      },
    },
    users: {
      create: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      roles: {
        create: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
      },
    },
  };
}
