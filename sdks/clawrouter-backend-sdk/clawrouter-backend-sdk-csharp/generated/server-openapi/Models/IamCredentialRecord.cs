using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamCredentialRecord
    {
        public string? CreatedAt { get; set; }
        public string? CredentialHash { get; set; }
        public string? CredentialType { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
    }
}
