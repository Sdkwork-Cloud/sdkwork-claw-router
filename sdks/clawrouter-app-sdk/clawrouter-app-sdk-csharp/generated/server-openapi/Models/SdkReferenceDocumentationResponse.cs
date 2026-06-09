using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SdkReferenceDocumentationResponse
    {
        public bool Generated { get; set; }
        public string Language { get; set; }
        public string? MethodDefinition { get; set; }
        public string Readme { get; set; }
        public string? UsageExample { get; set; }
    }
}
