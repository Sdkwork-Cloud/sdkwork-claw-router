using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSiteModelUpdateRequest
    {
        public List<string>? Capabilities { get; set; }
        public int? ContextTokens { get; set; }
        public string? DisplayName { get; set; }
        public int? MaxInputTokens { get; set; }
        public int? MaxOutputTokens { get; set; }
        public string? Modality { get; set; }
        public string? ModelCode { get; set; }
        public string? ModelName { get; set; }
        public string? ProviderModel { get; set; }
        public string? ProviderNativeModel { get; set; }
        public string? Status { get; set; }
        public bool? SupportsJsonSchema { get; set; }
        public bool? SupportsStreaming { get; set; }
        public bool? SupportsTools { get; set; }
        public string? VendorCode { get; set; }
    }
}
