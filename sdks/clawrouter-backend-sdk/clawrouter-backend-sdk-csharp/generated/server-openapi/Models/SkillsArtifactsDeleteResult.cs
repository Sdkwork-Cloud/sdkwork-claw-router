using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsArtifactsDeleteResult
    {
        public string Code { get; set; }
        public AdminSkillArtifactDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
