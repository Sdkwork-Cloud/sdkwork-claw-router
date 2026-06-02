using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceOrderAddressSnapshotRecord
    {
        public string? AddressLine1Encrypted { get; set; }
        public string? CapturedAt { get; set; }
        public string? City { get; set; }
        public string? CountryCode { get; set; }
        public string? District { get; set; }
        public string? Id { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? PhoneMasked { get; set; }
        public string? PostalCode { get; set; }
        public string? RecipientNameSnapshot { get; set; }
        public string? RegionCode { get; set; }
        public string? SnapshotVersion { get; set; }
        public string? SourceAddressId { get; set; }
        public string? TenantId { get; set; }
    }
}
