using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillAssetListResponse
    {
        public List<AdminSkillAssetItem>? Items { get; set; }
    }
}
