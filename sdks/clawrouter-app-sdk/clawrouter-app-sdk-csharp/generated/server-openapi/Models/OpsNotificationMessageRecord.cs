using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpsNotificationMessageRecord
    {
        public string? ActionUrl { get; set; }
        public string? AppId { get; set; }
        public string? Content { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? ExpireAt { get; set; }
        public string? Id { get; set; }
        public string? MessageCode { get; set; }
        public string? MessageType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishedAt { get; set; }
        public string? Severity { get; set; }
        public string? Status { get; set; }
        public string? Summary { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
