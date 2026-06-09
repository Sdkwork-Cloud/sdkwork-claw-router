using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamAppContext
    {
        public string AppId { get; set; }
        public string AuthLevel { get; set; }
        public List<string> DataScope { get; set; }
        public string DeploymentMode { get; set; }
        public string Environment { get; set; }
        public string? OrganizationId { get; set; }
        public List<string> PermissionScope { get; set; }
        public string SessionId { get; set; }
        public string TenantId { get; set; }
        public string UserId { get; set; }
    }
}
