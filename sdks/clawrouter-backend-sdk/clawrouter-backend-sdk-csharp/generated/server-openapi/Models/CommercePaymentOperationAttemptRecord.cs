using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentOperationAttemptRecord
    {
        public string? ChannelId { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? HttpStatus { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? NativeRefundId { get; set; }
        public string? NativeRequestId { get; set; }
        public string? NativeTradeId { get; set; }
        public string? OperationCode { get; set; }
        public string? OperationNo { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderErrorCode { get; set; }
        public string? ProviderErrorMessage { get; set; }
        public string? RequestDigest { get; set; }
        public string? ResponseDigest { get; set; }
        public string? Retryable { get; set; }
        public string? SdkworkResourceId { get; set; }
        public string? SdkworkResourceType { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
    }
}
