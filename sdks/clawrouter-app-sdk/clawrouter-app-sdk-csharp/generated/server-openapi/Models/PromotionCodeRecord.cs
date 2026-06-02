using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionCodeRecord
    {
        public string? ActivatedAt { get; set; }
        public string? ActivationStatus { get; set; }
        public bool? CanResend { get; set; }
        public string? CancelUntil { get; set; }
        public string? CanceledAt { get; set; }
        public string? ChannelCode { get; set; }
        public string? ClaimCodeHash { get; set; }
        public string? ClaimCodeSuffix { get; set; }
        public string? ClaimedQuantity { get; set; }
        public string? CodeNo { get; set; }
        public string? CodeType { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? CurrencyCode { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? MaxClaims { get; set; }
        public string? OfferId { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public string? PromotionCodeHash { get; set; }
        public string? PromotionCodeLast4 { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? StockId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
