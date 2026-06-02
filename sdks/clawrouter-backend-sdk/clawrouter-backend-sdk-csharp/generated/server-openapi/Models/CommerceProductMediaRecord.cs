using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductMediaRecord
    {
        public string? AltText { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? MediaResourceId { get; set; }
        public string? MediaRole { get; set; }
        public string? ObjectBlobId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? ResourceSnapshot { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
