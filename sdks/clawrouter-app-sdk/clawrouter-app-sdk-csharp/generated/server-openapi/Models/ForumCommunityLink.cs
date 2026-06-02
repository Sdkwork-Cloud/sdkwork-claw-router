using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumCommunityLink
    {
        public string? Id { get; set; }
        public string? Label { get; set; }
        public MediaResource? QrCode { get; set; }
        public string? Tone { get; set; }
        public string? Url { get; set; }
    }
}
