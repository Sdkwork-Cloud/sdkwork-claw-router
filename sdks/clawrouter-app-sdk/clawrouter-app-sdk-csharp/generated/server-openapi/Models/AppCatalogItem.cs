using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppCatalogItem
    {
        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? Developer { get; set; }
        public string? Downloads { get; set; }
        public List<string>? Features { get; set; }
        public string? Id { get; set; }
        public MediaResource? Image { get; set; }
        public string? Name { get; set; }
        public double? Rating { get; set; }
        public List<AppReleaseItem>? Releases { get; set; }
        public List<MediaResource>? Screenshots { get; set; }
    }
}
