using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusAgentSkillPackageRecord
    {
        public string? CategoryId { get; set; }
        public string? CoverImage { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public string? LatestPublishedAt { get; set; }
        public string? Summary { get; set; }
        public string? UserId { get; set; }
    }
}
