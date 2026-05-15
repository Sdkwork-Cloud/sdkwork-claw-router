using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceWalletOverviewResponse
    {
        public string? AvailableAmount { get; set; }
        public string? CurrencyCode { get; set; }
        public string? FrozenAmount { get; set; }
    }
}
