using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseCollectionResponse
    {
        public List<AdminCourseItem>? Items { get; set; }
    }
}
