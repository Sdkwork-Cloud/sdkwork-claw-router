using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAiResourceGroupItem
    {
        public string? Description { get; set; }
        public bool? Dynamic { get; set; }
        public string? GroupCode { get; set; }
        public string? GroupName { get; set; }
        public string? GroupType { get; set; }
        public string? Id { get; set; }
        public int? ResourceCount { get; set; }
        public string? SelectionMode { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
    }
}
