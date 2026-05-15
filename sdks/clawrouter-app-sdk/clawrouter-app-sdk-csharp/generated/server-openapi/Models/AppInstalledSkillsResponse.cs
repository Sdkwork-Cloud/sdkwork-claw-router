using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppInstalledSkillsResponse
    {
        public List<AppInstalledSkillItem>? Items { get; set; }
    }
}
