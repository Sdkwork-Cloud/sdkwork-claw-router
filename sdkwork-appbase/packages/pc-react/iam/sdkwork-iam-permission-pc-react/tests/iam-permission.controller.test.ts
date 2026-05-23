import { describe, expect, it, vi } from "vitest";

import { createSdkworkIamPermissionController } from "../src/index";

describe("@sdkwork/iam-permission-pc-react", () => {
  it("manages IAM roles, permissions, policies, and authorization hints through the standard IAM service", async () => {
    const service = {
      iam: {
        permissions: {
          list: vi.fn().mockResolvedValue([
            {
              action: "read",
              code: "iam.users.read",
              id: "permission-1",
              name: "Read users",
              resource: "iam.users",
            },
          ]),
        },
        policies: {
          list: vi.fn().mockResolvedValue({
            records: [
              {
                code: "default-policy",
                id: "policy-1",
                name: "Default Policy",
              },
            ],
          }),
        },
        roles: {
          list: vi.fn().mockResolvedValue([
            {
              code: "admin",
              name: "Admin",
              roleId: "role-1",
            },
          ]),
          permissions: {
            create: vi.fn().mockResolvedValue({ id: "rp-1" }),
            delete: vi.fn().mockResolvedValue(undefined),
            list: vi.fn().mockResolvedValue([
              {
                action: "read",
                code: "iam.users.read",
                id: "permission-1",
                name: "Read users",
                resource: "iam.users",
              },
            ]),
          },
        },
        users: {
          roles: {
            create: vi.fn().mockResolvedValue({ id: "ur-1" }),
            delete: vi.fn().mockResolvedValue(undefined),
            list: vi.fn().mockResolvedValue([
              {
                roleId: "role-1",
                userId: "user-1",
              },
            ]),
          },
        },
      },
    };

    const controller = createSdkworkIamPermissionController({
      permissionScope: ["iam.audit.*"],
      service: service as never,
    });

    await expect(controller.listRoles()).resolves.toEqual([
      {
        code: "admin",
        id: "role-1",
        name: "Admin",
        roleId: "role-1",
        status: undefined,
        tenantId: undefined,
      },
    ]);
    await controller.listPermissions();
    await controller.listPolicies();
    await controller.listRolePermissions("role-1");
    await controller.listUserRoles("user-1");
    await controller.assignRolePermission("role-1", "permission-1");
    await controller.revokeRolePermission("role-1", "permission-1");
    await controller.assignUserRole("user-1", "role-1");
    await controller.revokeUserRole("user-1", "role-1");

    expect(controller.can("iam.users.read")).toBe(true);
    expect(controller.can({ action: "read", resource: "iam.audit" })).toBe(true);
    expect(controller.can({ action: "delete", resource: "iam.users" })).toBe(false);
    expect(service.iam.roles.permissions.create).toHaveBeenCalledWith("role-1", "permission-1");
    expect(service.iam.users.roles.create).toHaveBeenCalledWith("user-1", "role-1");
  });
});
