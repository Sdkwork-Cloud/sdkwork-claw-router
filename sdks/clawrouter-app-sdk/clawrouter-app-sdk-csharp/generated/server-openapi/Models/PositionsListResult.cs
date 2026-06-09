using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PositionsListResult
    {
        public string Code { get; set; }
        public IamPositionListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
