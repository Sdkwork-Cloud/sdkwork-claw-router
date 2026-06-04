import assert from "node:assert/strict";
import test from "node:test";

import { getAdminModuleMenu } from "./src/adminModuleRegistry.ts";
import { getActiveSidebarItemPaths, isSidebarItemActive } from "./src/adminSidebarActive.ts";

test("admin sidebar resolves only the most specific active item for channel child routes", () => {
  const homeMenu = getAdminModuleMenu("home");
  const accountPoolGroup = homeMenu.groups.find((group) => group.groupKey === "admin.menu.home.accountPoolManagement");

  assert.ok(accountPoolGroup, "account pool group must exist");

  const channelItem = accountPoolGroup.items.find((item) => item.path === "/admin/channel");
  const resourcesItem = accountPoolGroup.items.find((item) => item.path === "/admin/channel/resources");

  assert.ok(channelItem, "channel menu item must exist");
  assert.ok(resourcesItem, "resources menu item must exist");
  assert.equal(
    accountPoolGroup.items.some((item) => item.path === "/admin/channel/endpoints"),
    false,
    "channel endpoints menu item must not exist",
  );

  assert.deepEqual(getActiveSidebarItemPaths("/admin/channel/resources", homeMenu), ["/admin/channel/resources"]);
  assert.equal(isSidebarItemActive("/admin/channel/resources", channelItem, accountPoolGroup.items), false);
  assert.equal(isSidebarItemActive("/admin/channel/resources", resourcesItem, accountPoolGroup.items), true);

  assert.deepEqual(getActiveSidebarItemPaths("/admin/channel/endpoints", homeMenu), []);
  assert.equal(isSidebarItemActive("/admin/channel/endpoints", channelItem, accountPoolGroup.items), false);
  assert.equal(isSidebarItemActive("/admin/channel/endpoints", resourcesItem, accountPoolGroup.items), false);
});
