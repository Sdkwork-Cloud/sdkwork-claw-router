using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceRechargePackageMutationRequest
    {
        public int? Bonus { get; set; }
        public string? Rmb { get; set; }
        public string? Status { get; set; }
    }
}
