using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminUserItem
    {
        public string? Balance { get; set; }
        public string? CreatedAt { get; set; }
        public string? Email { get; set; }
        public string? Group { get; set; }
        public int? Id { get; set; }
        public string? LastActive { get; set; }
        public string? LastUsed { get; set; }
        public string? Role { get; set; }
        public string? Status { get; set; }
        public string? Username { get; set; }
    }
}
