using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentCaptureRecord
    {
        public string? Amount { get; set; }
        public string? CaptureNo { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? FailedAt { get; set; }
        public string? FailureCode { get; set; }
        public string? FailureMessage { get; set; }
        public string? FinalCapture { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? NativeCaptureId { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaymentAttemptId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? RequestNo { get; set; }
        public string? Status { get; set; }
        public string? SubmittedAt { get; set; }
        public string? SucceededAt { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
