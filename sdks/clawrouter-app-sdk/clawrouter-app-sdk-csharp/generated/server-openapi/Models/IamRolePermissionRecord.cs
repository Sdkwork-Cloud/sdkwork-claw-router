using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamRolePermissionRecord
    {
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? PermissionId { get; set; }
        public string? RoleId { get; set; }
        public string? TenantId { get; set; }
    }
}
