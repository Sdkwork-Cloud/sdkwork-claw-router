using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamOrganizationMemberRecord
    {
        public string? Id { get; set; }
        public string? JoinedAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? RoleCode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UserId { get; set; }
    }
}
