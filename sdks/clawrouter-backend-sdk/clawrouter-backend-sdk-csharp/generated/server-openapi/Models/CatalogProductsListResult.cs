using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogProductsListResult
    {
        public string? Code { get; set; }
        public CommerceProductSpuListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
