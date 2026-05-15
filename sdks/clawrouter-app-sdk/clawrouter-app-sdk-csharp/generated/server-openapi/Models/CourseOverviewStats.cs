using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseOverviewStats
    {
        public int? TotalCategories { get; set; }
        public int? TotalCourses { get; set; }
        public int? TotalLessons { get; set; }
        public int? TotalStudents { get; set; }
    }
}
