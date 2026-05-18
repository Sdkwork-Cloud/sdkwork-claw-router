using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamUserRoleRecord
    {
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? RoleId { get; set; }
        public string? TenantId { get; set; }
        public string? UserId { get; set; }
    }
}
