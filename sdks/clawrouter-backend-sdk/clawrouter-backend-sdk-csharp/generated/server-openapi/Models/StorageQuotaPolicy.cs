using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class StorageQuotaPolicy
    {
        public string? CreatedAt { get; set; }
        public string? Enforcement { get; set; }
        public string? Id { get; set; }
        public int? Limit { get; set; }
        public int? QuotaLimitBytes { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public int? SingleFileLimitBytes { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
        public int? Used { get; set; }
        public int? UsedBytes { get; set; }
    }
}
