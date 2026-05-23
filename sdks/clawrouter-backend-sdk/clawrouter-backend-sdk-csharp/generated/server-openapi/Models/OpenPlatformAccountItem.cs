using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformAccountItem
    {
        public string? AesKeyRef { get; set; }
        public string? AppId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DefaultEntryId { get; set; }
        public string? Id { get; set; }
        public string? Key { get; set; }
        public string? Name { get; set; }
        public string? Provider { get; set; }
        public bool? QrDefault { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public string? TokenRef { get; set; }
        public string? Type { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
