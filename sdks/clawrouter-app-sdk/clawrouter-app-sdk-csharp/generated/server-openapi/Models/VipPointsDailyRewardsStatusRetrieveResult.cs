using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class VipPointsDailyRewardsStatusRetrieveResult
    {
        public string? Code { get; set; }
        public CommerceVipDailyRewardStatusResponse? Data { get; set; }
        public string? Message { get; set; }
        public string? Msg { get; set; }
    }
}
