using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamLoginQrCodeResponse
    {
        public string? Description { get; set; }
        public int? ExpireTime { get; set; }
        public string? QrContent { get; set; }
        public string? QrKey { get; set; }
        public string? QrUrl { get; set; }
        public string? Title { get; set; }
        public string? Type { get; set; }
    }
}
