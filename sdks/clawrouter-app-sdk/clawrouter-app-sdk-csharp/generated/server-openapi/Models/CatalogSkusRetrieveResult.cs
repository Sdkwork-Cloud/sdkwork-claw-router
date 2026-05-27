using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CatalogSkusRetrieveResult
    {
        public string? Code { get; set; }
        public CommerceProductSkuResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
