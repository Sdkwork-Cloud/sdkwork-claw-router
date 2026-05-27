using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseDashboard
    {
        public int? DraftCourses { get; set; }
        public string? Id { get; set; }
        public int? PublishedCourses { get; set; }
        public int? ReviewQueue { get; set; }
        public int? TotalComments { get; set; }
        public int? TotalCourses { get; set; }
        public int? TotalEngagement { get; set; }
        public int? TotalLessons { get; set; }
        public int? TotalStudents { get; set; }
    }
}
