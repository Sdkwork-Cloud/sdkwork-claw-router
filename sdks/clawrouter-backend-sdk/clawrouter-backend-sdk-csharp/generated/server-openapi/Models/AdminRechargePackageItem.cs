using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRechargePackageItem
    {
        public string? BonusPoints { get; set; }
        public string? CurrencyCode { get; set; }
        public string? GrantAmount { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? PackageNo { get; set; }
        public string? Points { get; set; }
        public string? PriceAmount { get; set; }
        public string? SkuId { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
