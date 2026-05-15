using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiQuotaPolicyRecord
    {
        public string? BlockDurationSeconds { get; set; }
        public string? BurstLimit { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? ExhaustedAt { get; set; }
        public string? GroupId { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PolicyCode { get; set; }
        public string? QuotaLimit { get; set; }
        public string? QuotaPeriod { get; set; }
        public string? QuotaUnit { get; set; }
        public string? RequestsPerDay { get; set; }
        public string? RequestsPerMinute { get; set; }
        public string? RequestsPerSecond { get; set; }
        public string? ResetMode { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public string? Status { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectRefHash { get; set; }
        public string? SubjectRefMasked { get; set; }
        public string? SubjectType { get; set; }
        public string? TenantId { get; set; }
        public string? TokensPerMinute { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
