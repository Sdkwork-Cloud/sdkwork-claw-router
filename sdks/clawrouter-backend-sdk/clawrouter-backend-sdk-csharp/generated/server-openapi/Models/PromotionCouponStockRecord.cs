using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionCouponStockRecord
    {
        public string? ActivationStatus { get; set; }
        public string? AvailableQuantity { get; set; }
        public string? BudgetAccountId { get; set; }
        public int? BudgetStopThresholdBps { get; set; }
        public int? BudgetWarningThresholdBps { get; set; }
        public bool? CanResend { get; set; }
        public string? CancelUntil { get; set; }
        public string? ClaimedQuantity { get; set; }
        public string? CodeMode { get; set; }
        public string? CodePrefix { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DisabledQuantity { get; set; }
        public string? ExpiresAt { get; set; }
        public string? GeneratedQuantity { get; set; }
        public string? Id { get; set; }
        public string? IssueChannel { get; set; }
        public string? LockedQuantity { get; set; }
        public int? MaxClaimsPerNaturalPerson { get; set; }
        public int? MaxClaimsPerSubject { get; set; }
        public string? Name { get; set; }
        public string? OfferId { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OverspendPolicy { get; set; }
        public string? PerSubjectLimit { get; set; }
        public string? RedeemedQuantity { get; set; }
        public string? RequestedQuantity { get; set; }
        public string? ReturnedQuantity { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? StockCreatorMerchantId { get; set; }
        public string? StockNo { get; set; }
        public string? StockType { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? TotalQuantity { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
