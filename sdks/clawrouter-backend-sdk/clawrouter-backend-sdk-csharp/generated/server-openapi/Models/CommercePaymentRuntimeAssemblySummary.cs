using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentRuntimeAssemblySummary
    {
        public string? Failed { get; set; }
        public List<string>? FailedProviderCodes { get; set; }
        public string? Registered { get; set; }
        public List<string>? RegisteredProviderCodes { get; set; }
        public string? Skipped { get; set; }
        public List<string>? SkippedProviderCodes { get; set; }
        public string? Total { get; set; }
    }
}
