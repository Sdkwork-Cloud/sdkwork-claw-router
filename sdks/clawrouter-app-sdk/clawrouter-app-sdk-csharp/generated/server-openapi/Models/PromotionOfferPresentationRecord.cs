using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionOfferPresentationRecord
    {
        public string? BrandName { get; set; }
        public string? CoverAssetId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public Dictionary<string, string>? CustomerActionJson { get; set; }
        public string? DisplayName { get; set; }
        public Dictionary<string, string>? FieldSchemaJson { get; set; }
        public string? Locale { get; set; }
        public string? LogoAssetId { get; set; }
        public string? MerchantDisplayName { get; set; }
        public string? OfferId { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? ParamSchemaJson { get; set; }
        public string? PresentationNo { get; set; }
        public string? PrimaryColor { get; set; }
        public string? RecognitionHash { get; set; }
        public string? RecognitionType { get; set; }
        public string? SecondaryColor { get; set; }
        public string? Status { get; set; }
        public Dictionary<string, string>? StyleSnapshotJson { get; set; }
        public string? SurfaceType { get; set; }
        public string? TenantId { get; set; }
        public Dictionary<string, string>? TermsJson { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public string? VerifyMethod { get; set; }
    }
}
