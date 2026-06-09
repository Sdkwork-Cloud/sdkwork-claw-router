using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamRoleBindingItem
    {
        public string ConditionJson { get; set; }
        public string CreatedAt { get; set; }
        public string Effect { get; set; }
        public string Id { get; set; }
        public string PrincipalId { get; set; }
        public string PrincipalKind { get; set; }
        public string RoleId { get; set; }
        public string ScopeId { get; set; }
        public string ScopeKind { get; set; }
        public string Status { get; set; }
        public string TenantId { get; set; }
        public string UpdatedAt { get; set; }
    }
}
