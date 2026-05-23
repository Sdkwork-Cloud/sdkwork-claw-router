using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsListResult
    {
        public string? Code { get; set; }
        public AdminSkillListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
