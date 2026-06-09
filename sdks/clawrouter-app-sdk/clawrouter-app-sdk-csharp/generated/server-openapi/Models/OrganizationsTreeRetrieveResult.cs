using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OrganizationsTreeRetrieveResult
    {
        public string Code { get; set; }
        public IamOrganizationTreeResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
