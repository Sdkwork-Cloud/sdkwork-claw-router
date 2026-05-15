using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminApiKeyCreateRequest
    {
        public string? Name { get; set; }
        public int? UserId { get; set; }
    }
}
