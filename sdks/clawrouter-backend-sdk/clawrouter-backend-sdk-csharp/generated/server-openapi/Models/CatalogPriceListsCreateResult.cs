using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogPriceListsCreateResult
    {
        public string? Code { get; set; }
        public CommercePriceListMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
