using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamDepartmentAssignmentItem
    {
        public string AssignmentKind { get; set; }
        public string CreatedAt { get; set; }
        public string DepartmentId { get; set; }
        public string EffectiveFrom { get; set; }
        public string EffectiveTo { get; set; }
        public string Id { get; set; }
        public bool IsPrimary { get; set; }
        public string OrganizationId { get; set; }
        public string OrganizationMembershipId { get; set; }
        public string Status { get; set; }
        public string TenantId { get; set; }
        public string UpdatedAt { get; set; }
        public string UserId { get; set; }
    }
}
