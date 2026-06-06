using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseOverviewStats
    {
        public string? TotalCategories { get; set; }
        public string? TotalCourses { get; set; }
        public string? TotalLessons { get; set; }
        public string? TotalStudents { get; set; }
    }
}
