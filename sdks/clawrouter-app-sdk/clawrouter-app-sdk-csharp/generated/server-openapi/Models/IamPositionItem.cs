using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamPositionItem
    {
        public string Code { get; set; }
        public string CreatedAt { get; set; }
        public string DepartmentId { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string OrganizationId { get; set; }
        public string PositionKind { get; set; }
        public string RankLevel { get; set; }
        public string Status { get; set; }
        public string TenantId { get; set; }
        public string UpdatedAt { get; set; }
    }
}
