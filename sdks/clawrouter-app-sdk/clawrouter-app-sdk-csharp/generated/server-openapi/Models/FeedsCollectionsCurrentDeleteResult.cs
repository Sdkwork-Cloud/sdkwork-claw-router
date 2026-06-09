using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class FeedsCollectionsCurrentDeleteResult
    {
        public string Code { get; set; }
        public ForumFeedItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
