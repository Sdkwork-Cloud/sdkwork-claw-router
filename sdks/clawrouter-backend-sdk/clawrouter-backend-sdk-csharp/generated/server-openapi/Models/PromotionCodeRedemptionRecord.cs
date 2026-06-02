using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionCodeRedemptionRecord
    {
        public string? CodeId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? FailureCode { get; set; }
        public string? FailureMessage { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OccurredAt { get; set; }
        public string? OfferId { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? RedemptionChannel { get; set; }
        public string? RedemptionNo { get; set; }
        public string? RedemptionScene { get; set; }
        public string? RequestNo { get; set; }
        public string? ResultStatus { get; set; }
        public string? StockId { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectType { get; set; }
        public string? SubmittedCodeHash { get; set; }
        public string? SubmittedCodeSuffix { get; set; }
        public string? TenantId { get; set; }
        public string? UserCouponId { get; set; }
    }
}
