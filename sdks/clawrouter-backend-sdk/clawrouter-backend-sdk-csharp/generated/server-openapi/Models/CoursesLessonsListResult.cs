using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CoursesLessonsListResult
    {
        public string Code { get; set; }
        public AdminCourseLessonCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
