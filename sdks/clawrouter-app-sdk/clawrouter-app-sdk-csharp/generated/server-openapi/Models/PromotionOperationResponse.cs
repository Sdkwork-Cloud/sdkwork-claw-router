using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionOperationResponse
    {
        public string? PaymentId { get; set; }
        public string? QrCodeImageUrl { get; set; }
        public string? QrCodePayload { get; set; }
        public string? RequestNo { get; set; }
        public string? Status { get; set; }
        public bool? Success { get; set; }
    }
}
