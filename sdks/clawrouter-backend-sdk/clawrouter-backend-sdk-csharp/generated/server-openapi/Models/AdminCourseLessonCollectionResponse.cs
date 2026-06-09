using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseLessonCollectionResponse
    {
        public List<AdminCourseLessonItem> Items { get; set; }
    }
}
