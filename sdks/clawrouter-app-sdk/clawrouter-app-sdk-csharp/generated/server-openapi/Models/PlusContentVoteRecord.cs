using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PlusContentVoteRecord
    {
        public string? ClientIp { get; set; }
        public string? DeviceInfo { get; set; }
        public string? Source { get; set; }
        public string? UserId { get; set; }
    }
}
