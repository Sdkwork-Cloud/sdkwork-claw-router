using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseDashboard
    {
        public string DraftCourses { get; set; }
        public string Id { get; set; }
        public string PublishedCourses { get; set; }
        public string ReviewQueue { get; set; }
        public string TotalComments { get; set; }
        public string TotalCourses { get; set; }
        public string TotalEngagement { get; set; }
        public string TotalLessons { get; set; }
        public string TotalStudents { get; set; }
    }
}
