using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OrganizationsListResult
    {
        public string Code { get; set; }
        public IamOrganizationListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
