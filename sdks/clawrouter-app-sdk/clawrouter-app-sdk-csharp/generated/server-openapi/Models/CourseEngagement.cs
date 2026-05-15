using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseEngagement
    {
        public int? Discussions { get; set; }
        public int? Likes { get; set; }
        public int? Saves { get; set; }
        public int? Shares { get; set; }
        public int? StudentsCount { get; set; }
        public int? Views { get; set; }
    }
}
