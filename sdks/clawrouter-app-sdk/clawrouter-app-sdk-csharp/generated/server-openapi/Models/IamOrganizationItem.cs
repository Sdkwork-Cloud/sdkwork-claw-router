using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamOrganizationItem
    {
        public string Code { get; set; }
        public string CreatedAt { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string? ParentId { get; set; }
        public string Path { get; set; }
        public string Status { get; set; }
        public string TenantId { get; set; }
        public string UpdatedAt { get; set; }
    }
}
