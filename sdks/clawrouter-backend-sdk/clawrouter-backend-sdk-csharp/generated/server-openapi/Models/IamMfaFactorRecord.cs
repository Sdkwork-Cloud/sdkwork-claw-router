using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamMfaFactorRecord
    {
        public string? CreatedAt { get; set; }
        public string? FactorType { get; set; }
        public string? Id { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
    }
}
