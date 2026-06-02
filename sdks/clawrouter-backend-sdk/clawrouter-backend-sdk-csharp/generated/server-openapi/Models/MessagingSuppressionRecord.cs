using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class MessagingSuppressionRecord
    {
        public string? Channel { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EndsAt { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Note { get; set; }
        public string? OrganizationId { get; set; }
        public string? ReasonCode { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public string? Source { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? TargetHash { get; set; }
        public string? TargetMasked { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
