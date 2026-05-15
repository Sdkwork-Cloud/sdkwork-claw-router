using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceWalletAccountItem
    {
        public string? AssetType { get; set; }
        public string? AvailableAmount { get; set; }
        public string? CurrencyCode { get; set; }
        public string? FrozenAmount { get; set; }
        public string? Id { get; set; }
        public string? Status { get; set; }
    }
}
