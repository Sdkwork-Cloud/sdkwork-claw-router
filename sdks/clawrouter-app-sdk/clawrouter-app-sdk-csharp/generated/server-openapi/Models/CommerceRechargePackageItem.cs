using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRechargePackageItem
    {
        public int? BonusPoints { get; set; }
        public string? CurrencyCode { get; set; }
        public int? GrantAmount { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? PackageNo { get; set; }
        public int? Points { get; set; }
        public string? PriceAmount { get; set; }
        public string? SkuId { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
