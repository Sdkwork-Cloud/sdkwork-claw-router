using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiResourceRouteProfileRecord
    {
        public string? BillingMeterCode { get; set; }
        public string? CacheTtlSeconds { get; set; }
        public string? Capability { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EndpointFailoverScope { get; set; }
        public string? FailureStrategy { get; set; }
        public string? HttpMethod { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyMode { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ModelRequirement { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? ParentObjectTypes { get; set; }
        public string? PathPattern { get; set; }
        public Dictionary<string, string>? RequestExtractors { get; set; }
        public string? ResourceCode { get; set; }
        public string? ResourceId { get; set; }
        public Dictionary<string, string>? ResponseBindings { get; set; }
        public string? RouteKey { get; set; }
        public string? RouteStrategy { get; set; }
        public string? SelectionStrategy { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? StickyObjectType { get; set; }
        public string? StickyScope { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
