using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionOfferVersionRecord
    {
        public string? BenefitDefinitionId { get; set; }
        public string? BenefitKind { get; set; }
        public string? BenefitQuantity { get; set; }
        public string? BreakagePolicy { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? CurrencyCode { get; set; }
        public bool? CustomerVisible { get; set; }
        public string? DiscountAmountMinor { get; set; }
        public int? DiscountPercentBps { get; set; }
        public string? DiscountType { get; set; }
        public string? FaceValueMinor { get; set; }
        public string? FixedPriceMinor { get; set; }
        public string? Id { get; set; }
        public string? LiabilityPolicy { get; set; }
        public string? LifecycleStatus { get; set; }
        public string? MaximumDiscountAmountMinor { get; set; }
        public string? MinimumOrderAmountMinor { get; set; }
        public string? OfferId { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishedAt { get; set; }
        public string? ReturnPolicy { get; set; }
        public Dictionary<string, string>? RuleSnapshotJson { get; set; }
        public string? SettlementPolicy { get; set; }
        public string? StackStrategy { get; set; }
        public string? TaxTreatment { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public string? ValidityDurationSeconds { get; set; }
        public string? ValidityType { get; set; }
        public string? VersionNo { get; set; }
    }
}
