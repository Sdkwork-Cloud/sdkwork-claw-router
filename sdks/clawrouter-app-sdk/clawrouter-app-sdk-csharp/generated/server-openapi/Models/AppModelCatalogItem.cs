using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppModelCatalogItem
    {
        public string? ApiFormat { get; set; }
        public List<string>? Capabilities { get; set; }
        public string? CapabilityIntro { get; set; }
        public string? CatalogKey { get; set; }
        public List<string>? Categories { get; set; }
        public string? ContextTokens { get; set; }
        public string? Description { get; set; }
        public string? DisplayName { get; set; }
        public List<string>? Groups { get; set; }
        public List<string>? InputModalities { get; set; }
        public List<string>? Limitations { get; set; }
        public string? MaxOutputTokens { get; set; }
        public List<string>? Modalities { get; set; }
        public string? Model { get; set; }
        public List<AppModelCatalogReferencePrice>? OfficialReferencePrices { get; set; }
        public List<string>? OutputModalities { get; set; }
        public AppModelCatalogPriceAvailability? PriceAvailability { get; set; }
        public List<string>? ProviderCodes { get; set; }
        public string? ReleaseStage { get; set; }
        public string? ReplacementModel { get; set; }
        public string? RoutingState { get; set; }
        public string? ShelfState { get; set; }
        public List<string>? SupportedLanguages { get; set; }
        public bool? SupportsJsonSchema { get; set; }
        public bool? SupportsStreaming { get; set; }
        public bool? SupportsTools { get; set; }
        public string? TrainingDataCutoff { get; set; }
        public List<string>? UseCases { get; set; }
        public string? Vendor { get; set; }
        public string? VendorCode { get; set; }
    }
}
