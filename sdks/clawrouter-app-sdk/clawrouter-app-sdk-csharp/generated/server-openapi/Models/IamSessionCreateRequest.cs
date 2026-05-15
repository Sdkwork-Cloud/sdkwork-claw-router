using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamSessionCreateRequest
    {
        public string? Code { get; set; }
        public string? DeviceId { get; set; }
        public string? DeviceName { get; set; }
        public string? DeviceType { get; set; }
        public string? Email { get; set; }
        public string? GrantType { get; set; }
        public string? Name { get; set; }
        public string? OrganizationCode { get; set; }
        public string? Password { get; set; }
        public string? Phone { get; set; }
        public string? Subject { get; set; }
        public string? TenantCode { get; set; }
        public string? Username { get; set; }
    }
}
