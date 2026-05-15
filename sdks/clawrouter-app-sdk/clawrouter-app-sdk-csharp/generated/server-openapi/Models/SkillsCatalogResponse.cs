using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SkillsCatalogResponse
    {
        public List<SkillCatalogItem>? Items { get; set; }
    }
}
