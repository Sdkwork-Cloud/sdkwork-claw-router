using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogAttributesListResult
    {
        public string? Code { get; set; }
        public CommerceProductAttributeListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
