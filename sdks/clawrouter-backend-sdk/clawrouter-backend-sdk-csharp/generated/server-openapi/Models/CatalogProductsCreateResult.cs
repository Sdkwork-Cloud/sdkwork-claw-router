using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogProductsCreateResult
    {
        public string? Code { get; set; }
        public CommerceProductSpuMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
