using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsPublishResult
    {
        public string? Code { get; set; }
        public AdminSkillMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
