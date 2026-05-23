using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceUserAddressRecord
    {
        public string? AddressLine1Encrypted { get; set; }
        public string? AddressLine2Encrypted { get; set; }
        public string? City { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? District { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PhoneCountryCode { get; set; }
        public string? PhoneMasked { get; set; }
        public string? PhoneNumberEncrypted { get; set; }
        public string? PostalCode { get; set; }
        public string? RecipientName { get; set; }
        public string? RegionCode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
