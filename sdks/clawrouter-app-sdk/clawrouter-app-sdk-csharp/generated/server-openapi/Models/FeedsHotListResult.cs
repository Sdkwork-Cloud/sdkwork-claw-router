using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class FeedsHotListResult
    {
        public string Code { get; set; }
        public List<ForumFeedItem>? Data { get; set; }
        public string? Msg { get; set; }
    }
}
