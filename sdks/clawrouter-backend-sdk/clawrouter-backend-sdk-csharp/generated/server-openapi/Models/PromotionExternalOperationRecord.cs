using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionExternalOperationRecord
    {
        public string? AggregateId { get; set; }
        public string? AggregateType { get; set; }
        public string? BindingId { get; set; }
        public string? CallbackAt { get; set; }
        public string? CallbackId { get; set; }
        public string? CallbackSigHash { get; set; }
        public string? CancelUntil { get; set; }
        public string? CreatedAt { get; set; }
        public string? ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ExternalOperationId { get; set; }
        public string? ExternalRequestNo { get; set; }
        public string? ExternalStatus { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? NextRetryAt { get; set; }
        public string? OccurredAt { get; set; }
        public string? OperationNo { get; set; }
        public string? OperationType { get; set; }
        public string? OrganizationId { get; set; }
        public string? Platform { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderRequestId { get; set; }
        public string? ReplayOpId { get; set; }
        public string? RequestHash { get; set; }
        public string? ResponseHash { get; set; }
        public Dictionary<string, string>? SanitizedRequestJson { get; set; }
        public Dictionary<string, string>? SanitizedResponseJson { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
    }
}
