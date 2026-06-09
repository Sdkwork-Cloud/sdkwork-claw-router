using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CourseCommentsModerateResult
    {
        public string Code { get; set; }
        public AdminCourseCommentCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
