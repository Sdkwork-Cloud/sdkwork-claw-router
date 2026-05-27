using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionsDiscountApplicationsReleaseResult
    {
        public string? Code { get; set; }
        public PromotionOperationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
