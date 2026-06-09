using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamOrganizationMembershipListResponse
    {
        public List<IamOrganizationMembershipItem> Items { get; set; }
    }
}
