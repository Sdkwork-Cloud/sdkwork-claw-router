using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseEngagement
    {
        public string Discussions { get; set; }
        public string Likes { get; set; }
        public string Saves { get; set; }
        public string Shares { get; set; }
        public string StudentsCount { get; set; }
        public string Views { get; set; }
    }
}
