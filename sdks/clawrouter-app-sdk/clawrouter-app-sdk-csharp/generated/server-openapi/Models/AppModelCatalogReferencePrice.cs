using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppModelCatalogReferencePrice
    {
        public string? BillingMeter { get; set; }
        public string? Currency { get; set; }
        public string? UnitPrice { get; set; }
    }
}
