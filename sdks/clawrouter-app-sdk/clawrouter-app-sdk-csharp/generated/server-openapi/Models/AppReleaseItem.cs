using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppReleaseItem
    {
        public MediaResource Artifact { get; set; }
        public string Id { get; set; }
        public string Os { get; set; }
        public string PlatformType { get; set; }
        public string ReleaseDate { get; set; }
        public string Size { get; set; }
        public string Version { get; set; }
        public string? WhatsNew { get; set; }
    }
}
