using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseCommentCollectionResponse
    {
        public List<AdminCourseCommentItem> Items { get; set; }
    }
}
