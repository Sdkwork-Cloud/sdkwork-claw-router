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
  const endpointsItem = accountPoolGroup.items.find((item) => item.path === "/admin/channel/endpoints");

  assert.ok(channelItem, "channel menu item must exist");
  assert.ok(resourcesItem, "resources menu item must exist");
  assert.ok(endpointsItem, "endpoints menu item must exist");

  assert.deepEqual(getActiveSidebarItemPaths("/admin/channel/resources", homeMenu), ["/admin/channel/resources"]);
  assert.equal(isSidebarItemActive("/admin/channel/resources", channelItem, accountPoolGroup.items), false);
  assert.equal(isSidebarItemActive("/admin/channel/resources", resourcesItem, accountPoolGroup.items), true);
  assert.equal(isSidebarItemActive("/admin/channel/resources", endpointsItem, accountPoolGroup.items), false);

  assert.deepEqual(getActiveSidebarItemPaths("/admin/channel/endpoints", homeMenu), ["/admin/channel/endpoints"]);
  assert.equal(isSidebarItemActive("/admin/channel/endpoints", channelItem, accountPoolGroup.items), false);
  assert.equal(isSidebarItemActive("/admin/channel/endpoints", resourcesItem, accountPoolGroup.items), false);
  assert.equal(isSidebarItemActive("/admin/channel/endpoints", endpointsItem, accountPoolGroup.items), true);
});
