using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillPackageListResponse
    {
        public List<AdminSkillPackageItem> Items { get; set; }
    }
}
