using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class MessagingSenderIdentityRecord
    {
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DisplayName { get; set; }
        public string? DomainName { get; set; }
        public string? FromEmail { get; set; }
        public string? FromName { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? RejectionReason { get; set; }
        public string? ReplyTo { get; set; }
        public string? SenderId { get; set; }
        public string? SignName { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VerifiedAt { get; set; }
        public string? Version { get; set; }
    }
}
