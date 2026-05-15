using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamAuditEventRecord
    {
        public string? Action { get; set; }
        public string? ActorUserId { get; set; }
        public string? AppId { get; set; }
        public string? CreatedAt { get; set; }
        public Dictionary<string, string>? DetailJson { get; set; }
        public string? Environment { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? RequestId { get; set; }
        public string? ResourceId { get; set; }
        public string? ResourceType { get; set; }
        public string? ShardingKey { get; set; }
        public string? TenantId { get; set; }
    }
}
