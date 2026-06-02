using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseInstructor
    {
        public MediaResource? Avatar { get; set; }
        public string? Bio { get; set; }
        public string? Name { get; set; }
        public string? Title { get; set; }
    }
}
