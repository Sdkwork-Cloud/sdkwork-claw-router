using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogPriceListsListResult
    {
        public string? Code { get; set; }
        public CommercePriceListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
