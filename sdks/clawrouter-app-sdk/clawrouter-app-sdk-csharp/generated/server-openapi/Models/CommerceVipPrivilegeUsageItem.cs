using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceVipPrivilegeUsageItem
    {
        public string? PeriodKey { get; set; }
        public string? PrivilegeCode { get; set; }
        public int? QuotaCount { get; set; }
        public int? UsedCount { get; set; }
    }
}
