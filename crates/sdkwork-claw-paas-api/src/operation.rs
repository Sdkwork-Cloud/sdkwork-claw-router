use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PaasCapability {
    Ocr,
    FaceCompare,
    FaceLivenessVerification,
    DocumentIntelligence,
    CertificateInvoice,
    SpeechRecognition,
    ContentModeration,
    AddressLogistics,
    NotificationMessaging,
    ObjectStorage,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PaasOperation {
    OcrGeneralText,
    OcrDocumentText,
    OcrIdCard,
    OcrBankCard,
    OcrBusinessLicense,
    OcrInvoice,
    FaceCompareOneToOne,
    FaceCompareOneToMany,
    FaceCompareQualityCheck,
    FaceLivenessDetection,
    FaceLivenessIdVerification,
    FaceLivenessVideo,
    DocumentLayoutAnalysis,
    DocumentTableExtraction,
    DocumentKeyValueExtraction,
    DocumentParse,
    CertificateIdCard,
    CertificatePassport,
    CertificateDriverLicense,
    CertificateBusinessLicense,
    CertificateVatInvoice,
    CertificateReceipt,
    SpeechAsrShortAudio,
    SpeechRecordingFile,
    SpeechRealtimeAsr,
    ContentTextModeration,
    ContentImageModeration,
    ContentAudioModeration,
    ContentVideoModeration,
    AddressParse,
    PhoneAttribution,
    ExpressTrack,
    LogisticsStatus,
    SmsSend,
    SmsTemplate,
    OtpSend,
    DeliveryReceipt,
    ObjectStorageUpload,
    ObjectStorageSignedUrl,
    ObjectStorageBucketPolicy,
    ObjectStorageLifecycleRule,
}

impl PaasOperation {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::OcrGeneralText => "ocr.general_text",
            Self::OcrDocumentText => "ocr.document_text",
            Self::OcrIdCard => "ocr.id_card",
            Self::OcrBankCard => "ocr.bank_card",
            Self::OcrBusinessLicense => "ocr.business_license",
            Self::OcrInvoice => "ocr.invoice",
            Self::FaceCompareOneToOne => "face.compare.one_to_one",
            Self::FaceCompareOneToMany => "face.compare.one_to_many",
            Self::FaceCompareQualityCheck => "face.compare.quality_check",
            Self::FaceLivenessDetection => "face.liveness.detection",
            Self::FaceLivenessIdVerification => "face.liveness.id_verification",
            Self::FaceLivenessVideo => "face.liveness.video",
            Self::DocumentLayoutAnalysis => "document.layout_analysis",
            Self::DocumentTableExtraction => "document.table_extraction",
            Self::DocumentKeyValueExtraction => "document.key_value_extraction",
            Self::DocumentParse => "document.parse",
            Self::CertificateIdCard => "certificate.id_card",
            Self::CertificatePassport => "certificate.passport",
            Self::CertificateDriverLicense => "certificate.driver_license",
            Self::CertificateBusinessLicense => "certificate.business_license",
            Self::CertificateVatInvoice => "certificate.vat_invoice",
            Self::CertificateReceipt => "certificate.receipt",
            Self::SpeechAsrShortAudio => "speech.asr_short_audio",
            Self::SpeechRecordingFile => "speech.recording_file",
            Self::SpeechRealtimeAsr => "speech.realtime_asr",
            Self::ContentTextModeration => "content.text_moderation",
            Self::ContentImageModeration => "content.image_moderation",
            Self::ContentAudioModeration => "content.audio_moderation",
            Self::ContentVideoModeration => "content.video_moderation",
            Self::AddressParse => "address.parse",
            Self::PhoneAttribution => "phone.attribution",
            Self::ExpressTrack => "express.track",
            Self::LogisticsStatus => "logistics.status",
            Self::SmsSend => "notification.sms_send",
            Self::SmsTemplate => "notification.sms_template",
            Self::OtpSend => "notification.otp_send",
            Self::DeliveryReceipt => "notification.delivery_receipt",
            Self::ObjectStorageUpload => "object_storage.upload",
            Self::ObjectStorageSignedUrl => "object_storage.signed_url",
            Self::ObjectStorageBucketPolicy => "object_storage.bucket_policy",
            Self::ObjectStorageLifecycleRule => "object_storage.lifecycle_rule",
        }
    }
}

impl Serialize for PaasOperation {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.as_str())
    }
}

impl<'de> Deserialize<'de> for PaasOperation {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::from_str(value.as_str())
            .ok_or_else(|| serde::de::Error::custom(format!("unknown PaaS operation: {value}")))
    }
}

impl PaasOperation {
    pub fn from_str(value: &str) -> Option<Self> {
        Some(match value {
            "ocr.general_text" => Self::OcrGeneralText,
            "ocr.document_text" => Self::OcrDocumentText,
            "ocr.id_card" => Self::OcrIdCard,
            "ocr.bank_card" => Self::OcrBankCard,
            "ocr.business_license" => Self::OcrBusinessLicense,
            "ocr.invoice" => Self::OcrInvoice,
            "face.compare.one_to_one" => Self::FaceCompareOneToOne,
            "face.compare.one_to_many" => Self::FaceCompareOneToMany,
            "face.compare.quality_check" => Self::FaceCompareQualityCheck,
            "face.liveness.detection" => Self::FaceLivenessDetection,
            "face.liveness.id_verification" => Self::FaceLivenessIdVerification,
            "face.liveness.video" => Self::FaceLivenessVideo,
            "document.layout_analysis" => Self::DocumentLayoutAnalysis,
            "document.table_extraction" => Self::DocumentTableExtraction,
            "document.key_value_extraction" => Self::DocumentKeyValueExtraction,
            "document.parse" => Self::DocumentParse,
            "certificate.id_card" => Self::CertificateIdCard,
            "certificate.passport" => Self::CertificatePassport,
            "certificate.driver_license" => Self::CertificateDriverLicense,
            "certificate.business_license" => Self::CertificateBusinessLicense,
            "certificate.vat_invoice" => Self::CertificateVatInvoice,
            "certificate.receipt" => Self::CertificateReceipt,
            "speech.asr_short_audio" => Self::SpeechAsrShortAudio,
            "speech.recording_file" => Self::SpeechRecordingFile,
            "speech.realtime_asr" => Self::SpeechRealtimeAsr,
            "content.text_moderation" => Self::ContentTextModeration,
            "content.image_moderation" => Self::ContentImageModeration,
            "content.audio_moderation" => Self::ContentAudioModeration,
            "content.video_moderation" => Self::ContentVideoModeration,
            "address.parse" => Self::AddressParse,
            "phone.attribution" => Self::PhoneAttribution,
            "express.track" => Self::ExpressTrack,
            "logistics.status" => Self::LogisticsStatus,
            "notification.sms_send" => Self::SmsSend,
            "notification.sms_template" => Self::SmsTemplate,
            "notification.otp_send" => Self::OtpSend,
            "notification.delivery_receipt" => Self::DeliveryReceipt,
            "object_storage.upload" => Self::ObjectStorageUpload,
            "object_storage.signed_url" => Self::ObjectStorageSignedUrl,
            "object_storage.bucket_policy" => Self::ObjectStorageBucketPolicy,
            "object_storage.lifecycle_rule" => Self::ObjectStorageLifecycleRule,
            _ => return None,
        })
    }
}
