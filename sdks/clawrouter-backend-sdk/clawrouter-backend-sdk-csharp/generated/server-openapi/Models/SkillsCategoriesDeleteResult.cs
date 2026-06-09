using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsCategoriesDeleteResult
    {
        public string Code { get; set; }
        public AdminSkillCategoryDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
