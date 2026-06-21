export { AdminLayout } from './AdminLayout.tsx';
export {
  ADMIN_MODULES,
  getActiveModuleFromPath,
  getAdminModuleMenu,
  type AdminMenuGroup,
  type AdminMenuItem,
  type AdminModuleDef,
  type AdminModuleId,
  type AdminModuleMenu,
} from './adminModuleRegistry.ts';
export {
  AdminHeader,
  type AdminModuleDef as AdminHeaderModuleDef,
  type AdminModuleId as AdminHeaderModuleId,
} from './AdminHeader.tsx';
export {
  getActiveSidebarItemPaths,
  hasActiveSidebarGroupItem,
  isSidebarItemActive,
} from './adminSidebarActive.ts';
