using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceProductRecord
    {
        public string? CategoryId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Description { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProductNo { get; set; }
        public string? Status { get; set; }
        public string? Subtitle { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
