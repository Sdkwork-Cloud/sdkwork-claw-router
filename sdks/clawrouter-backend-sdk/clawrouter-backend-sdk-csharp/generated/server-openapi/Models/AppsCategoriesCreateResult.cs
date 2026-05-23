using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsCategoriesCreateResult
    {
        public string? Code { get; set; }
        public AdminAppCategoryMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
