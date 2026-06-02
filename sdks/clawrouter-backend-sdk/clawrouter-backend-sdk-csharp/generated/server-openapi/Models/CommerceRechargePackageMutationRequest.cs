using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceRechargePackageMutationRequest
    {
        public int? BonusPoints { get; set; }
        public string? CurrencyCode { get; set; }
        public string? PriceAmount { get; set; }
        public string? Status { get; set; }
    }
}
