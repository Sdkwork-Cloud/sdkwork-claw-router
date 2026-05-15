using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationProxyRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? Endpoint { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public string? LastCheckedAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProxyCode { get; set; }
        public string? ProxyType { get; set; }
        public string? Region { get; set; }
        public string? SecretHash { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
