using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class MessagingTemplateVariantRecord
    {
        public string? BodyTemplate { get; set; }
        public string? Channel { get; set; }
        public string? ContentFormat { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public int? LengthLimit { get; set; }
        public string? Locale { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? ProviderPayloadSchema { get; set; }
        public Dictionary<string, string>? RenderOptions { get; set; }
        public string? Status { get; set; }
        public string? TemplateVersionId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
