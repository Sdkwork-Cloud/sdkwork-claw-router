using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CatalogCategoriesCreateResult
    {
        public string? Code { get; set; }
        public CommerceProductCategoryMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
