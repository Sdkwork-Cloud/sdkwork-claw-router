using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsDisableResult
    {
        public string Code { get; set; }
        public AdminSkillMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
