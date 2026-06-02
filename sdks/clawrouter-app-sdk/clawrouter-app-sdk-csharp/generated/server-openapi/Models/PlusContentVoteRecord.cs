using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PlusContentVoteRecord
    {
        public string? ClientIp { get; set; }
        public string? ContentId { get; set; }
        public int? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public string? DeviceInfo { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? Rating { get; set; }
        public string? Source { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
    }
}
