using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseRelationCollectionResponse
    {
        public List<AdminCourseRelationItem>? Items { get; set; }
    }
}
