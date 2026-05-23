import { describe, expect, it, vi } from "vitest";

import { createSdkworkIamTenantController } from "../src/index";

describe("@sdkwork/iam-tenant-pc-react", () => {
  it("lists tenants, selects tenant context, and loads tenant members through the standard IAM service", async () => {
    const service = {
      iam: {
        tenants: {
          list: vi.fn().mockResolvedValue({
            records: [
              {
                code: "default",
                name: "Default Tenant",
                tenantId: "tenant-1",
              },
            ],
          }),
          members: {
            list: vi.fn().mockResolvedValue({
              data: [
                {
                  displayName: "Alice",
                  tenantId: "tenant-1",
                  userId: "user-1",
                },
              ],
            }),
          },
        },
      },
    };

    const controller = createSdkworkIamTenantController({
      selectedTenantId: "tenant-1",
      service: service as never,
    });

    await expect(controller.listTenants({ page_size: 20 })).resolves.toEqual([
      {
        code: "default",
        id: "tenant-1",
        name: "Default Tenant",
        status: undefined,
        tenantId: "tenant-1",
      },
    ]);
    await expect(controller.selectTenant("tenant-1")).resolves.toMatchObject({
      tenantId: "tenant-1",
    });
    await expect(controller.listTenantMembers("tenant-1")).resolves.toEqual([
      {
        displayName: "Alice",
        email: undefined,
        id: "user-1",
        roleCode: undefined,
        status: undefined,
        tenantId: "tenant-1",
        userId: "user-1",
        username: undefined,
      },
    ]);

    expect(service.iam.tenants.list).toHaveBeenCalledWith({ page_size: 20 });
    expect(service.iam.tenants.members.list).toHaveBeenCalledWith("tenant-1", undefined);
    expect(controller.getSelectedTenant()).toMatchObject({
      tenantId: "tenant-1",
    });
    expect(controller.getState()).toMatchObject({
      status: "ready",
      tenants: [
        {
          tenantId: "tenant-1",
        },
      ],
    });
  });
});
