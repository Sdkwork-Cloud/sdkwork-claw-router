using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class WalletAdjustmentsCreateResult
    {
        public string? Code { get; set; }
        public CommerceOperationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
