using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CoursesListResult
    {
        public string? Code { get; set; }
        public AdminCourseCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
