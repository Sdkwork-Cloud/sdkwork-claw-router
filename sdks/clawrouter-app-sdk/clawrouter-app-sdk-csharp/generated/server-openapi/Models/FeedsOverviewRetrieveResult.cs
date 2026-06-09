using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class FeedsOverviewRetrieveResult
    {
        public string Code { get; set; }
        public ForumOverviewResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
