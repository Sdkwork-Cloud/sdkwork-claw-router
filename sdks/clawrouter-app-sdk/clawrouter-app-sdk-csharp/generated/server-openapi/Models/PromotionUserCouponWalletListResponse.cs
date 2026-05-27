using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionUserCouponWalletListResponse
    {
        public List<PromotionCouponWalletItem>? Items { get; set; }
    }
}
