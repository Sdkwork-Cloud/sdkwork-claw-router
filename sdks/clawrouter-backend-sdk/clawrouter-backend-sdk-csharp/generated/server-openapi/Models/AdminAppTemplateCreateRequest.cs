using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAppTemplateCreateRequest
    {
        public Dictionary<string, string>? AppConfigSchema { get; set; }
        public List<Dictionary<string, string>>? CapabilityManifest { get; set; }
        public string? CategoryCode { get; set; }
        public string? CategoryId { get; set; }
        public string? CoverUrl { get; set; }
        public Dictionary<string, string>? DefaultAppConfig { get; set; }
        public List<Dictionary<string, string>>? DependencyManifest { get; set; }
        public string? Description { get; set; }
        public bool? Featured { get; set; }
        public string? Framework { get; set; }
        public string? GitRef { get; set; }
        public string? GitRepoUrl { get; set; }
        public string? GitSubPath { get; set; }
        public string? IconUrl { get; set; }
        public string? Language { get; set; }
        public string? PublishStatus { get; set; }
        public string? Runtime { get; set; }
        public int? SortWeight { get; set; }
        public string? SourceAppId { get; set; }
        public string? TemplateCode { get; set; }
        public string? TemplateName { get; set; }
        public string? TemplateNo { get; set; }
        public string? TemplateType { get; set; }
        public Dictionary<string, string>? VariableSchema { get; set; }
        public string? Visibility { get; set; }
    }
}
