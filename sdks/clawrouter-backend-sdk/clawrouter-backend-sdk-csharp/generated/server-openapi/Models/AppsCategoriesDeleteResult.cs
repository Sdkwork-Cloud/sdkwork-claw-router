using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsCategoriesDeleteResult
    {
        public string Code { get; set; }
        public AdminAppCategoryDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
