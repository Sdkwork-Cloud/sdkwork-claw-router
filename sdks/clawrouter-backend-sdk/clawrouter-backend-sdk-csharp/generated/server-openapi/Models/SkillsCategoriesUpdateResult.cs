using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsCategoriesUpdateResult
    {
        public string? Code { get; set; }
        public AdminSkillCategoryMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
