using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CatalogProductsRetrieveResult
    {
        public string? Code { get; set; }
        public CommerceProductSpuDetailResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
