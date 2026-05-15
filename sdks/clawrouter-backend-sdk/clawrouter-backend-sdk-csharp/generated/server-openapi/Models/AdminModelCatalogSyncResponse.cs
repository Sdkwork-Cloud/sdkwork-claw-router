using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminModelCatalogSyncResponse
    {
        public int? AcceptedCount { get; set; }
        public int? CapabilityCount { get; set; }
        public string? CatalogRoot { get; set; }
        public string? CatalogVersion { get; set; }
        public bool? DryRun { get; set; }
        public int? FamilyCount { get; set; }
        public int? MeterCount { get; set; }
        public string? Mode { get; set; }
        public int? ModelCount { get; set; }
        public List<AdminAiModelItem>? Models { get; set; }
        public int? PriceCount { get; set; }
        public int? RankingCount { get; set; }
        public string? RequestedCatalogVersion { get; set; }
        public string? SnapshotId { get; set; }
        public string? Source { get; set; }
        public string? SourceHash { get; set; }
        public string? SyncRunId { get; set; }
        public bool? Synced { get; set; }
        public List<string>? VendorCodes { get; set; }
        public int? VendorCount { get; set; }
        public List<AdminModelVendorItem>? Vendors { get; set; }
    }
}
