using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRechargePackageListResponse
    {
        public List<AdminRechargePackageItem>? Items { get; set; }
    }
}
