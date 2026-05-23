using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogSkusListResult
    {
        public string? Code { get; set; }
        public CommerceProductSkuListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
