using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamOauthSessionCreateRequest
    {
        public string? Code { get; set; }
        public string? DeviceId { get; set; }
        public string? DeviceType { get; set; }
        public string? Provider { get; set; }
        public string? State { get; set; }
    }
}
