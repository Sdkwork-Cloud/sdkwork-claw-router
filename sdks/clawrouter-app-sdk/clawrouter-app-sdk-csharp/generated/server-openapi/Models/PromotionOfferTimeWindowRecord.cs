using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionOfferTimeWindowRecord
    {
        public string? CreatedAt { get; set; }
        public string? EndsAt { get; set; }
        public string? LocalEndTime { get; set; }
        public string? LocalStartTime { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public string? StartsAt { get; set; }
        public string? TenantId { get; set; }
        public string? Timezone { get; set; }
        public string? UpdatedAt { get; set; }
        public int? WeekdayMask { get; set; }
        public string? WindowType { get; set; }
    }
}
