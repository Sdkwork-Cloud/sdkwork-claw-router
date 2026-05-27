using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CoursesRelationsReplaceResult
    {
        public string? Code { get; set; }
        public AdminCourseRelationCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
