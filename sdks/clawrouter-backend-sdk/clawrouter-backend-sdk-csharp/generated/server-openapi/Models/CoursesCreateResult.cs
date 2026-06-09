using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CoursesCreateResult
    {
        public string Code { get; set; }
        public AdminCourseMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
