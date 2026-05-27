using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CatalogCategoriesListResult
    {
        public string? Code { get; set; }
        public CommerceProductCategoryListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
