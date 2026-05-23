using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CouponsCatalogListResult
    {
        public string? Code { get; set; }
        public List<CommerceCouponCatalogItem>? Data { get; set; }
        public string? Msg { get; set; }
    }
}
