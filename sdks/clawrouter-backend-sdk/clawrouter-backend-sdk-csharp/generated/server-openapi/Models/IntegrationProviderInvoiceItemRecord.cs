using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IntegrationProviderInvoiceItemRecord
    {
        public string? Amount { get; set; }
        public string? BillingMeterCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? Id { get; set; }
        public string? ImportId { get; set; }
        public bool? LegalHold { get; set; }
        public string? MatchStatus { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProviderRequestId { get; set; }
        public string? ProviderUsageId { get; set; }
        public string? Quantity { get; set; }
        public string? RawPayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
