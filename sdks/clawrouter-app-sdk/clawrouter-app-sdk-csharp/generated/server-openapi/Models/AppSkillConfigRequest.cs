using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppSkillConfigRequest
    {
        public Dictionary<string, string>? Config { get; set; }
    }
}
