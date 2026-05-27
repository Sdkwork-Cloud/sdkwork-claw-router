using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CoursesLessonsCreateResult
    {
        public string? Code { get; set; }
        public AdminCourseLessonMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
