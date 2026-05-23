using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogAttributesCreateResult
    {
        public string? Code { get; set; }
        public CommerceProductAttributeMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
