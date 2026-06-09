using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsCategoriesCreateResult
    {
        public string Code { get; set; }
        public AdminSkillCategoryMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
