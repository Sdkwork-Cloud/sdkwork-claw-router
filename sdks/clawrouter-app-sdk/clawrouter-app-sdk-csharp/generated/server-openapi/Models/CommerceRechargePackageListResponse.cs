using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRechargePackageListResponse
    {
        public List<CommerceRechargePackageItem>? Items { get; set; }
    }
}
