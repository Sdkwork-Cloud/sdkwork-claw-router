using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiBillingMeterRecord
    {
        public string? AggregationMode { get; set; }
        public bool? AllowNegativeQuantity { get; set; }
        public string? BillingMode { get; set; }
        public string? CanonicalPriceItemType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultUnit { get; set; }
        public string? DefaultUnitSize { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? DisplayName { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MeterCode { get; set; }
        public string? Modality { get; set; }
        public string? OrganizationId { get; set; }
        public int? QuantityPrecision { get; set; }
        public string? QuantitySource { get; set; }
        public string? ResultSelector { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public bool? SupportsExpression { get; set; }
        public bool? SupportsTier { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsageType { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
