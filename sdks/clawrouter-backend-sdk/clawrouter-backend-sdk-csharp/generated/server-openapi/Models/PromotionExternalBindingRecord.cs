using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionExternalBindingRecord
    {
        public string? BindingNo { get; set; }
        public string? ClaimCodeHash { get; set; }
        public string? ClaimCodeSuffix { get; set; }
        public string? CodeId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? ExternalCurrencyCode { get; set; }
        public string? ExternalMerchantId { get; set; }
        public string? ExternalObjectId { get; set; }
        public string? ExternalObjectType { get; set; }
        public string? Id { get; set; }
        public string? LastErrorCode { get; set; }
        public string? LastErrorMessage { get; set; }
        public string? LastSyncAt { get; set; }
        public Dictionary<string, string>? MetadataJson { get; set; }
        public string? OfferId { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public string? Platform { get; set; }
        public string? PlatformCardId { get; set; }
        public string? PlatformCouponId { get; set; }
        public string? PlatformStockId { get; set; }
        public string? PlatformTemplateId { get; set; }
        public string? StockId { get; set; }
        public string? SyncStatus { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public string? UserCouponId { get; set; }
    }
}
