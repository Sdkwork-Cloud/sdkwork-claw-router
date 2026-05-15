using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumOverviewStats
    {
        public int? MemberCount { get; set; }
        public int? OnlineMembers { get; set; }
        public int? TotalComments { get; set; }
        public int? TotalPosts { get; set; }
    }
}
