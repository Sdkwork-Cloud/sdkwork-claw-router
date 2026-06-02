using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RechargesPackagesListResult
    {
        public string? Code { get; set; }
        public CommerceRechargePackageListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
