using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamUserIdentityRecord
    {
        public string? CreatedAt { get; set; }
        public string? Email { get; set; }
        public string? Id { get; set; }
        public string? Provider { get; set; }
        public string? Subject { get; set; }
        public string? TenantId { get; set; }
        public string? UserId { get; set; }
    }
}
