using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class RechargesPackagesListResult
    {
        public string? Code { get; set; }
        public AdminRechargePackageListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
