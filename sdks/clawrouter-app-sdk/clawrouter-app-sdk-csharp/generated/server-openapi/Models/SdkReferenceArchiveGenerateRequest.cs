using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SdkReferenceArchiveGenerateRequest
    {
        public Dictionary<string, object> Config { get; set; }
        public string Language { get; set; }
        public Dictionary<string, string> Spec { get; set; }
    }
}
