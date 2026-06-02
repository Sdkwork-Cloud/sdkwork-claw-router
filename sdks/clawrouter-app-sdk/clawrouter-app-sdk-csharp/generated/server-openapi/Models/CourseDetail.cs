using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseDetail
    {
        public string? Category { get; set; }
        public string? CategoryLabel { get; set; }
        public int? CommentCount { get; set; }
        public string? Content { get; set; }
        public int? ContentId { get; set; }
        public string? CourseCode { get; set; }
        public string? Currency { get; set; }
        public string? Description { get; set; }
        public string? DurationText { get; set; }
        public CourseEngagement? Engagement { get; set; }
        public string? ExternalBvid { get; set; }
        public string? Id { get; set; }
        public CourseInstructor? Instructor { get; set; }
        public bool? IsCollection { get; set; }
        public int? LessonsCount { get; set; }
        public int? Level { get; set; }
        public string? LevelLabel { get; set; }
        public string? PriceAmount { get; set; }
        public string? PublishedAt { get; set; }
        public double? RatingScore { get; set; }
        public List<CourseItem>? RelatedCourses { get; set; }
        public List<CourseSectionItem>? Sections { get; set; }
        public CourseOverviewSource? Source { get; set; }
        public int? StudentsCount { get; set; }
        public List<string>? Tags { get; set; }
        public MediaResource? Thumbnail { get; set; }
        public string? Title { get; set; }
    }
}
