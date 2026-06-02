using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PlusCategoryRecord
    {
        public string? Code { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public string? Description { get; set; }
        public string? GroupName { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? ParentId { get; set; }
        public string? Path { get; set; }
        public string? ShopId { get; set; }
        public int? SortWeight { get; set; }
        public int? Status { get; set; }
        public Dictionary<string, string>? Tags { get; set; }
        public string? TenantId { get; set; }
        public int? Type { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
        public bool? Visible { get; set; }
    }
}
