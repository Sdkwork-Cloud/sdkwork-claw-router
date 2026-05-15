using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamCurrentSessionUpdateRequest
    {
        public string? DeviceName { get; set; }
        public string? OrganizationCode { get; set; }
        public string? OrganizationId { get; set; }
    }
}
