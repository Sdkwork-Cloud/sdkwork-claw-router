using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsPackageRetrieveResult
    {
        public string? Code { get; set; }
        public AdminSkillPackageMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
