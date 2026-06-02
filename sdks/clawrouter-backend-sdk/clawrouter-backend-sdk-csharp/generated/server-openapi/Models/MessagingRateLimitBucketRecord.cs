using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class MessagingRateLimitBucketRecord
    {
        public string? Channel { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeviceHash { get; set; }
        public string? Id { get; set; }
        public string? IpHash { get; set; }
        public string? LastEventAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public int? RejectCount { get; set; }
        public string? SceneCode { get; set; }
        public int? SendCount { get; set; }
        public string? Status { get; set; }
        public string? TargetHash { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public int? VerifyCount { get; set; }
        public string? Version { get; set; }
        public int? WindowSeconds { get; set; }
        public string? WindowStart { get; set; }
    }
}
