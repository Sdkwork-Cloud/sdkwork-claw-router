using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogSkusCreateResult
    {
        public string? Code { get; set; }
        public CommerceProductSkuMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
