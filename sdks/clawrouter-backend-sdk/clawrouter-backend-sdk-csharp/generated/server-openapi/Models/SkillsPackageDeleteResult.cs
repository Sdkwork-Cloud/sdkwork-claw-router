using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsPackageDeleteResult
    {
        public string? Code { get; set; }
        public AdminSkillPackageDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
