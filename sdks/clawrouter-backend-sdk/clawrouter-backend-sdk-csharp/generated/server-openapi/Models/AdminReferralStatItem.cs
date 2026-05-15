using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminReferralStatItem
    {
        public string? BonusAwarded { get; set; }
        public string? Id { get; set; }
        public string? Inviter { get; set; }
        public string? Link { get; set; }
        public int? TotalInvited { get; set; }
        public string? TotalRevenue { get; set; }
    }
}
