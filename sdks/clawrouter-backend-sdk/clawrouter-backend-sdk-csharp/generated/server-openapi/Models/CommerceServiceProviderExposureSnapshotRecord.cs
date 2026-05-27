using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceServiceProviderExposureSnapshotRecord
    {
        public string? BalanceAmount { get; set; }
        public string? CalculatedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreditLimitAmount { get; set; }
        public string? Currency { get; set; }
        public string? ExposureAmount { get; set; }
        public string? FrozenAmount { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OverdueAmount { get; set; }
        public string? PendingSettlementAmount { get; set; }
        public string? RebuildVersion { get; set; }
        public string? RiskStatus { get; set; }
        public string? ServiceProviderId { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsedCreditAmount { get; set; }
        public string? Uuid { get; set; }
    }
}
