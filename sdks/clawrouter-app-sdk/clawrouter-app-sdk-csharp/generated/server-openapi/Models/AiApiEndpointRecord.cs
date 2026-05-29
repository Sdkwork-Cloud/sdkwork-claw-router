using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiApiEndpointRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DisplayName { get; set; }
        public string? EndpointCode { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Method { get; set; }
        public string? OrganizationId { get; set; }
        public string? PathTemplate { get; set; }
        public string? ProtocolCode { get; set; }
        public Dictionary<string, string>? RequestSchema { get; set; }
        public Dictionary<string, string>? ResponseSchema { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public bool? StreamingSupported { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
