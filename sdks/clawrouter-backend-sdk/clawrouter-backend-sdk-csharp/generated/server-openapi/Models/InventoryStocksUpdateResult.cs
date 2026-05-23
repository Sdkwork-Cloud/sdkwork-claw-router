using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class InventoryStocksUpdateResult
    {
        public string? Code { get; set; }
        public CommerceInventoryStockMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
