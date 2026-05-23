using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsPackageListResult
    {
        public string? Code { get; set; }
        public AdminSkillPackageListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
