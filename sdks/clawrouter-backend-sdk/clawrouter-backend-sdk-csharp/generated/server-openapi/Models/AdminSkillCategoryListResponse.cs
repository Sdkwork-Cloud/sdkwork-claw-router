using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillCategoryListResponse
    {
        public List<AdminSkillCategoryItem>? Items { get; set; }
    }
}
