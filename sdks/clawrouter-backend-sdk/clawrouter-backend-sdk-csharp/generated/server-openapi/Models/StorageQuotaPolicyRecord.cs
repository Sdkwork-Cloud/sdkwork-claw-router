using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class StorageQuotaPolicyRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Enforcement { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? QuotaLimitBytes { get; set; }
        public string? RequestId { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public string? SingleFileLimitBytes { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
