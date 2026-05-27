using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionCodeRedemptionRequest
    {
        public string? ClientRequestNo { get; set; }
        public string? Code { get; set; }
        public string? Note { get; set; }
        public string? Scene { get; set; }
        public string? Source { get; set; }
    }
}
