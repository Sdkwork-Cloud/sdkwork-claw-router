using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamUserResponse
    {
        public MediaResource Avatar { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Id { get; set; }
        public bool IsVerified { get; set; }
        public string Language { get; set; }
        public string LastLogin { get; set; }
        public string LastLoginIp { get; set; }
        public string PasswordLastChanged { get; set; }
        public string Phone { get; set; }
        public string RegisteredAt { get; set; }
        public string Status { get; set; }
        public string ThirdPartyBound { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string Username { get; set; }
    }
}
