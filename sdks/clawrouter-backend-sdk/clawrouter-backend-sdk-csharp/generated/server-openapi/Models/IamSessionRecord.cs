using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamSessionRecord
    {
        public string? AccessTokenHash { get; set; }
        public string? AppId { get; set; }
        public string? AuthLevel { get; set; }
        public string? AuthTokenHash { get; set; }
        public string? CreatedAt { get; set; }
        public Dictionary<string, string>? DataScopeJson { get; set; }
        public string? DeploymentMode { get; set; }
        public string? Environment { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PermissionScopeJson { get; set; }
        public string? RefreshTokenHash { get; set; }
        public string? RevokedAt { get; set; }
        public string? ShardingKey { get; set; }
        public string? ShardingStrategy { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
    }
}
