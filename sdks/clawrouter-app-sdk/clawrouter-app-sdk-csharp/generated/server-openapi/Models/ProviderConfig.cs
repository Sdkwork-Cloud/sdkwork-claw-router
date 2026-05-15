using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ProviderConfig
    {
        public string? Description { get; set; }
        public string? Id { get; set; }
        public string? IntegrationType { get; set; }
        public string? Name { get; set; }
        public string? ProviderFamily { get; set; }
        public string? Status { get; set; }
        public string? Url { get; set; }
    }
}
