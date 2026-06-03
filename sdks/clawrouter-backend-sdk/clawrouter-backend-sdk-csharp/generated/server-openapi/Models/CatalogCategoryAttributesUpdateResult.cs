using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogCategoryAttributesUpdateResult
    {
        public string? Code { get; set; }
        public CommerceProductCategoryAttributeMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
