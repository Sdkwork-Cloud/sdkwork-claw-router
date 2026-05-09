# sdkwork-claw-router-admin-group

用户分组与权限管理核心业务模块。

## 功能特性 (Features)
- **分组列表管理**：增删改查不同的用户权限组
- **状态监控**：实时检查各种分组的生效与禁用状态
- **资源隔离**：基于标识码配置可用的商业与开源模型

## API 设计标准 (API Specifications)
- \`GET /api/v1/admin/groups\`：获取分页的分组列表
- \`POST /api/v1/admin/groups\`：创建新分组
- \`PUT /api/v1/admin/groups/:id\`：更新已有分组信息
- \`DELETE /api/v1/admin/groups/:id\`：安全软删除分组

## 架构兼容性
本模块作为 \`AdminLayout\` 内部组件运行无缝接入，不产生全局状态污染。使用 React 18 模块化规范引入。
