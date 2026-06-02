using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentRuntimeAssemblySummary
    {
        public int? Failed { get; set; }
        public List<string>? FailedProviderCodes { get; set; }
        public int? Registered { get; set; }
        public List<string>? RegisteredProviderCodes { get; set; }
        public int? Skipped { get; set; }
        public List<string>? SkippedProviderCodes { get; set; }
        public int? Total { get; set; }
    }
}
