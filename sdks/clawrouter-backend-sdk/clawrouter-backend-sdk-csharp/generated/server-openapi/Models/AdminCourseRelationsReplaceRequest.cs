using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseRelationsReplaceRequest
    {
        public List<Dictionary<string, object>> Items { get; set; }
    }
}
