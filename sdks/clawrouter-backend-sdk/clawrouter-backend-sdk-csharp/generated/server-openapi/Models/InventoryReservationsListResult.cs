using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class InventoryReservationsListResult
    {
        public string? Code { get; set; }
        public CommerceInventoryReservationListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
