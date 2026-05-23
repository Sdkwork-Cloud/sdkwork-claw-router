using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSiteSettingsUpdateRequest
    {
        public string? AccentColor { get; set; }
        public string? BrandColor { get; set; }
        public string? CustomCss { get; set; }
        public string? Description { get; set; }
        public string? DocsUrl { get; set; }
        public string? FaviconUrl { get; set; }
        public string? FooterCopyright { get; set; }
        public string? IconUrl { get; set; }
        public string? IcpRecordNumber { get; set; }
        public string? IcpRecordUrl { get; set; }
        public string? LogoUrl { get; set; }
        public string? PoliceRecordNumber { get; set; }
        public string? PoliceRecordUrl { get; set; }
        public string? PrivacyUrl { get; set; }
        public string? SeoDescription { get; set; }
        public string? SeoTitle { get; set; }
        public string? ShortName { get; set; }
        public string? SiteName { get; set; }
        public string? SupportUrl { get; set; }
        public string? TermsUrl { get; set; }
    }
}
