using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ObjectBucketRecord
    {
        public string? BucketName { get; set; }
        public string? BucketRegion { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataResidencyRegion { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? KmsKeyRef { get; set; }
        public string? LogicalScope { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderId { get; set; }
        public string? RequestId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
