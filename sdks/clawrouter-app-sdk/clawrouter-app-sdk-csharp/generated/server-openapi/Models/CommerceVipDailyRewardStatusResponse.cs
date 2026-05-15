using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceVipDailyRewardStatusResponse
    {
        public bool? Available { get; set; }
        public bool? ClaimedToday { get; set; }
    }
}
