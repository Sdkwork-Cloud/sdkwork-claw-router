using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumAuthor
    {
        public MediaResource? Avatar { get; set; }
        public string? Bio { get; set; }
        public int? Id { get; set; }
        public bool? IsFollowing { get; set; }
        public string? Name { get; set; }
    }
}
