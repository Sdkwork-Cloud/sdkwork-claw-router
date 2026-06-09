using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SkillDetailResponse
    {
        public string Category { get; set; }
        public string ClawhubImage { get; set; }
        public string Description { get; set; }
        public string Developer { get; set; }
        public string Downloads { get; set; }
        public List<string> Features { get; set; }
        public List<string> Frameworks { get; set; }
        public string Id { get; set; }
        public MediaResource Image { get; set; }
        public string LastUpdated { get; set; }
        public string License { get; set; }
        public string Name { get; set; }
        public List<SkillPackageItem>? Packages { get; set; }
        public double Rating { get; set; }
        public List<MediaResource> Screenshots { get; set; }
        public string Size { get; set; }
        public string Version { get; set; }
    }
}
