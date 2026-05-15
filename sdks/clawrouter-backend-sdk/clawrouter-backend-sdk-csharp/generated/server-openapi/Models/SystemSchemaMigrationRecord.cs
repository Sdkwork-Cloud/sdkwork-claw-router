using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SystemSchemaMigrationRecord
    {
        public string? Checksum { get; set; }
        public string? ErrorMessage { get; set; }
        public string? FinishedAt { get; set; }
        public string? Id { get; set; }
        public string? MigrationKey { get; set; }
        public string? MigrationVersion { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
    }
}
