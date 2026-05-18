using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamPermissionRecord
    {
        public string? Action { get; set; }
        public string? Code { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Resource { get; set; }
    }
}
