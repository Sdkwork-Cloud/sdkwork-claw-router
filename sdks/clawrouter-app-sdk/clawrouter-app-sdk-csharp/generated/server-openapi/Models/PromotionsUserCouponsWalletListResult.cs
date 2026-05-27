using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionsUserCouponsWalletListResult
    {
        public string? Code { get; set; }
        public PromotionUserCouponWalletListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
