using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SkillsListResult
    {
        public string? Code { get; set; }
        public SkillsCatalogResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
