using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiRouteIdempotencyRecord
    {
        public string? ApiKeyId { get; set; }
        public string? ChannelGroupId { get; set; }
        public string? ChannelId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EndpointId { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ObjectId { get; set; }
        public string? ObjectType { get; set; }
        public string? OrganizationId { get; set; }
        public string? RequestHash { get; set; }
        public int? ResponseStatus { get; set; }
        public string? RouteStrategy { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
