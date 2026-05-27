using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SdkReferenceArchiveResponse
    {
        public string? ContentBase64 { get; set; }
        public string? ContentType { get; set; }
        public string? FileName { get; set; }
        public string? Language { get; set; }
    }
}
