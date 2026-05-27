using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpenPlatformAccountRecord
    {
        public string? AccountKey { get; set; }
        public string? AccountType { get; set; }
        public string? AesKeyRef { get; set; }
        public string? AppId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultEntryId { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? Provider { get; set; }
        public bool? QrDefault { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TokenRef { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
