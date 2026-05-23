using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SkillsEnableResult
    {
        public string? Code { get; set; }
        public AppInstalledSkillResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
