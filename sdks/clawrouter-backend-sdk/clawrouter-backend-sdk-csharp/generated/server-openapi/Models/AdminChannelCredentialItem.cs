using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminChannelCredentialItem
    {
        public string? ApiKey { get; set; }
        public string? BaseUrl { get; set; }
        public string? CredentialId { get; set; }
        public int? Errors { get; set; }
        public string? Id { get; set; }
        public string? MaskedLabel { get; set; }
        public string? Name { get; set; }
        public int? Priority { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public int? Weight { get; set; }
    }
}
