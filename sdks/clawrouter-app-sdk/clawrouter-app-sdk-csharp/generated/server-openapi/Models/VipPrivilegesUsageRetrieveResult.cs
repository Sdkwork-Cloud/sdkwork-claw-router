using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class VipPrivilegesUsageRetrieveResult
    {
        public string? Code { get; set; }
        public List<CommerceVipPrivilegeUsageItem>? Data { get; set; }
        public string? Message { get; set; }
        public string? Msg { get; set; }
    }
}
