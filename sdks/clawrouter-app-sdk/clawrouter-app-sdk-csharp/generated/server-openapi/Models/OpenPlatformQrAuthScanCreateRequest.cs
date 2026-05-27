using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpenPlatformQrAuthScanCreateRequest
    {
        public string? AccountId { get; set; }
        public string? EntryId { get; set; }
        public string? ExternalUserId { get; set; }
        public string? IpHash { get; set; }
        public string? ScanSource { get; set; }
        public string? UserAgent { get; set; }
    }
}
