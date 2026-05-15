using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminTransactionRecordItem
    {
        public string? Amount { get; set; }
        public string? Balance { get; set; }
        public string? Description { get; set; }
        public string? Id { get; set; }
        public string? Status { get; set; }
        public string? Time { get; set; }
        public string? Type { get; set; }
        public string? UserId { get; set; }
    }
}
