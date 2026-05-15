using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationWebhookEndpointRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EndpointCode { get; set; }
        public Dictionary<string, string>? EventTypes { get; set; }
        public string? FailureCount { get; set; }
        public string? Id { get; set; }
        public string? LastFailureAt { get; set; }
        public string? LastSuccessAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? RetryPolicy { get; set; }
        public string? SecretHash { get; set; }
        public string? SecretRef { get; set; }
        public string? SigningAlg { get; set; }
        public string? Status { get; set; }
        public string? TargetUrl { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
