using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class DocumentationCreateResult
    {
        public string Code { get; set; }
        public SdkReferenceDocumentationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
