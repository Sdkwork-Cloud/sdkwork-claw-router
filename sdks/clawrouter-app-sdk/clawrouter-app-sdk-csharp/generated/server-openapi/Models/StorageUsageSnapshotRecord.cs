using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class StorageUsageSnapshotRecord
    {
        public string? AppId { get; set; }
        public string? BusinessDomain { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? FileCount { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ReservedBytes { get; set; }
        public string? RetainedBytes { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public string? SnapshotAt { get; set; }
        public string? SnapshotType { get; set; }
        public string? SpaceId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TrashBytes { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsedLogicalBytes { get; set; }
        public string? UsedPhysicalBytes { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
