using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ContentAnnouncementRecord
    {
        public string? AnnouncementType { get; set; }
        public Dictionary<string, string>? AudienceFilter { get; set; }
        public string? Content { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public bool? Pinned { get; set; }
        public string? PublishedAt { get; set; }
        public string? Status { get; set; }
        public string? TargetScope { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
