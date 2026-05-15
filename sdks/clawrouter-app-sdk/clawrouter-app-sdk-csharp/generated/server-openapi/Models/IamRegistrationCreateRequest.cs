using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamRegistrationCreateRequest
    {
        public string? Channel { get; set; }
        public string? ConfirmPassword { get; set; }
        public string? Email { get; set; }
        public string? OrganizationCode { get; set; }
        public string? Password { get; set; }
        public string? Phone { get; set; }
        public string? TenantCode { get; set; }
        public string? Username { get; set; }
        public string? VerificationCode { get; set; }
    }
}
