using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentRuntimeSnapshotResponse
    {
        public string? Environment { get; set; }
        public List<CommercePaymentRuntimeAssemblyEvent>? Events { get; set; }
        public string? RecordedAt { get; set; }
        public CommercePaymentRuntimeAssemblySummary? Summary { get; set; }
    }
}
