using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumOverviewStats
    {
        public string? MemberCount { get; set; }
        public string? OnlineMembers { get; set; }
        public string? TotalComments { get; set; }
        public string? TotalPosts { get; set; }
    }
}
