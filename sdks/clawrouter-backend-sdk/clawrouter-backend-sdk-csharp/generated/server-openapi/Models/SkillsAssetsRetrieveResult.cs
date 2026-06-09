using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SkillsAssetsRetrieveResult
    {
        public string Code { get; set; }
        public AdminSkillAssetMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
