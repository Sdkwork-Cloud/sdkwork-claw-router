using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsArtifactsUpdateResult
    {
        public string? Code { get; set; }
        public AdminSkillArtifactMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
