using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAgentItem
    {
        public MediaResource? Avatar { get; set; }
        public AdminAgentCapabilities? Capabilities { get; set; }
        public string? Code { get; set; }
        public string? CreatedAt { get; set; }
        public AdminAgentVersionItem? DefaultVersion { get; set; }
        public string? Description { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? OwnerUserId { get; set; }
        public string? Status { get; set; }
        public string? TemplateSource { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Visibility { get; set; }
    }
}
