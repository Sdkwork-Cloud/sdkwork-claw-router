using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class RechargesPackagesCreateResult
    {
        public string? Code { get; set; }
        public AdminRechargePackageMutationResponse? Data { get; set; }
        public string? Message { get; set; }
        public string? Msg { get; set; }
    }
}
