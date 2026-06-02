using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsRuntimeSnapshotRetrieveResult
    {
        public string? Code { get; set; }
        public CommercePaymentRuntimeSnapshotResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
