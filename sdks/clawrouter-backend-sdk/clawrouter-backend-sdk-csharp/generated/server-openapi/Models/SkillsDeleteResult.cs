using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsDeleteResult
    {
        public string Code { get; set; }
        public AdminSkillDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
