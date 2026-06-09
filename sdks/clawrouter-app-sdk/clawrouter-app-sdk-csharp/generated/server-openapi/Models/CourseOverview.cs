using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseOverview
    {
        public CourseOverviewSource Source { get; set; }
        public CourseOverviewStats Stats { get; set; }
    }
}
