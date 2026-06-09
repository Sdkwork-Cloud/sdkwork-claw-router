using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamPositionAssignmentItem
    {
        public string CreatedAt { get; set; }
        public string DepartmentAssignmentId { get; set; }
        public string EffectiveFrom { get; set; }
        public string EffectiveTo { get; set; }
        public string Id { get; set; }
        public bool IsPrimary { get; set; }
        public string OrganizationId { get; set; }
        public string PositionId { get; set; }
        public string Status { get; set; }
        public string TenantId { get; set; }
        public string UpdatedAt { get; set; }
        public string UserId { get; set; }
    }
}
