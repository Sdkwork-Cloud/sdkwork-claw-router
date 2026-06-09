using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumOverviewResponse
    {
        public List<ForumCommunityLink> CommunityLinks { get; set; }
        public ForumOverviewSource Source { get; set; }
        public ForumOverviewStats Stats { get; set; }
    }
}
