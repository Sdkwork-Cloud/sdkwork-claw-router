using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AuthVerificationPolicy
    {
        public bool? EmailCodeLoginEnabled { get; set; }
        public bool? EmailRegistrationVerificationRequired { get; set; }
        public bool? PhoneCodeLoginEnabled { get; set; }
        public bool? PhoneRegistrationVerificationRequired { get; set; }
    }
}
