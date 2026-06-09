using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillArtifactListResponse
    {
        public List<AdminSkillArtifactItem> Items { get; set; }
    }
}
