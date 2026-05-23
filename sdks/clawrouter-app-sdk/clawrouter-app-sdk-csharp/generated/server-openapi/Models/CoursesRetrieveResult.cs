using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CoursesRetrieveResult
    {
        public string? Code { get; set; }
        public CourseDetail? Data { get; set; }
        public string? Msg { get; set; }
    }
}
