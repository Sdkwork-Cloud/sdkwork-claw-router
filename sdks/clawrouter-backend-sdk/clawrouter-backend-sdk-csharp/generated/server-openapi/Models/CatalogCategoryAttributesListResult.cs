using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogCategoryAttributesListResult
    {
        public string? Code { get; set; }
        public CommerceProductCategoryAttributeListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
