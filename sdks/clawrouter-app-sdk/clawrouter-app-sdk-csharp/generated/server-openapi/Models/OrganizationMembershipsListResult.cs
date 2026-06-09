using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OrganizationMembershipsListResult
    {
        public string Code { get; set; }
        public IamOrganizationMembershipListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
