import { describe, expect, it, vi } from "vitest";

import { buildSdkworkIamOrganizationTree, createSdkworkIamOrganizationController } from "../src/index";

describe("@sdkwork/iam-organization-pc-react", () => {
  it("lists organizations, builds a tree, selects organization context, and manages members", async () => {
    const service = {
      iam: {
        organizations: {
          list: vi.fn().mockResolvedValue([
            {
              name: "Headquarters",
              organizationId: "org-root",
            },
            {
              name: "Research",
              organizationId: "org-child",
              parentId: "org-root",
            },
          ]),
          members: {
            create: vi.fn().mockResolvedValue({
              id: "member-2",
              organizationId: "org-child",
              userId: "user-2",
            }),
            list: vi.fn().mockResolvedValue({
              records: [
                {
                  displayName: "Alice",
                  organizationId: "org-child",
                  userId: "user-1",
                },
              ],
            }),
          },
        },
      },
    };

    const controller = createSdkworkIamOrganizationController(service as never);

    await controller.listOrganizations({ tenantId: "tenant-1" });
    expect(controller.getState().tree).toMatchObject([
      {
        children: [
          {
            depth: 1,
            organizationId: "org-child",
          },
        ],
        depth: 0,
        organizationId: "org-root",
      },
    ]);

    await expect(controller.selectOrganization("org-child")).resolves.toMatchObject({
      organizationId: "org-child",
    });
    await expect(controller.listMembers("org-child")).resolves.toEqual([
      {
        displayName: "Alice",
        email: undefined,
        id: "user-1",
        organizationId: "org-child",
        roleCode: undefined,
        status: undefined,
        userId: "user-1",
        username: undefined,
      },
    ]);
    await expect(controller.addMember("org-child", { userId: "user-2" })).resolves.toMatchObject({
      id: "member-2",
      organizationId: "org-child",
      userId: "user-2",
    });

    expect(service.iam.organizations.list).toHaveBeenCalledWith({ tenantId: "tenant-1" });
    expect(service.iam.organizations.members.list).toHaveBeenCalledWith("org-child", undefined);
    expect(service.iam.organizations.members.create).toHaveBeenCalledWith("org-child", { userId: "user-2" });
  });

  it("builds organization trees without a controller", () => {
    expect(
      buildSdkworkIamOrganizationTree([
        {
          id: "root",
          name: "Root",
          organizationId: "root",
        },
        {
          id: "child",
          name: "Child",
          organizationId: "child",
          parentId: "root",
        },
      ]),
    ).toMatchObject([
      {
        children: [
          {
            depth: 1,
            organizationId: "child",
          },
        ],
        depth: 0,
        organizationId: "root",
      },
    ]);
  });
});
