using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ObjectProviderRecord
    {
        public string? CreatedAt { get; set; }
        public string? CredentialRef { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EndpointUrl { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? LastHealthCheckAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public bool? PathStyleEnabled { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderType { get; set; }
        public string? Region { get; set; }
        public string? RequestId { get; set; }
        public string? Status { get; set; }
        public bool? SupportsLifecycle { get; set; }
        public bool? SupportsMultipart { get; set; }
        public bool? SupportsObjectLock { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
