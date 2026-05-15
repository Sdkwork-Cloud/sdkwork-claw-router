using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminUserUpdateRequest
    {
        public string? Group { get; set; }
        public int? Id { get; set; }
        public string? Status { get; set; }
        public string? Username { get; set; }
    }
}
