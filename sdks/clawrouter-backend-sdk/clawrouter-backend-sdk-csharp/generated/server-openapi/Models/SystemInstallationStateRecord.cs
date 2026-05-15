using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SystemInstallationStateRecord
    {
        public string? CatalogVersion { get; set; }
        public string? DatabaseEngine { get; set; }
        public string? Environment { get; set; }
        public string? Id { get; set; }
        public string? InstallationId { get; set; }
        public string? InstalledAt { get; set; }
        public string? LastCheckedAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? SchemaVersion { get; set; }
        public string? SeedProfile { get; set; }
        public string? Status { get; set; }
        public string? UpgradedAt { get; set; }
    }
}
