using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiGenerationSessionRecord
    {
        public string? ActiveModality { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public Dictionary<string, string>? FilterConfig { get; set; }
        public string? Id { get; set; }
        public string? LastOpenedAt { get; set; }
        public string? LastPrompt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? SelectedModels { get; set; }
        public string? SessionCode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
