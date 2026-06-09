using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamOrganizationListResponse
    {
        public List<IamOrganizationItem> Items { get; set; }
    }
}
