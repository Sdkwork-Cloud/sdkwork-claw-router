using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryLedgerListResponse
    {
        public List<CommerceInventoryLedgerItem>? Items { get; set; }
        public int? Page { get; set; }
        public int? PageSize { get; set; }
        public int? Total { get; set; }
    }
}
