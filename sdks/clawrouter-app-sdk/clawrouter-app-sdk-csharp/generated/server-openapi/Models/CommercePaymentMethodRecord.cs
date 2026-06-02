using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentMethodRecord
    {
        public string? CreatedAt { get; set; }
        public string? DisplayName { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? MethodKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? Provider { get; set; }
        public string? RequestNo { get; set; }
        public string? SortWeight { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
