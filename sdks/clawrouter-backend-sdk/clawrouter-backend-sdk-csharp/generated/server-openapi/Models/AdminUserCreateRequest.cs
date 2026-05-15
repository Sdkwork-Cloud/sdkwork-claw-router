using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminUserCreateRequest
    {
        public string? Balance { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
    }
}
