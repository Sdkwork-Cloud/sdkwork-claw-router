Map<String, dynamic>? _sdkworkAsMap(dynamic value) {
  if (value is Map<String, dynamic>) {
    return value;
  }
  if (value is Map) {
    return value.map((key, item) => MapEntry(key.toString(), item));
  }
  return null;
}

List<dynamic>? _sdkworkAsList(dynamic value) {
  return value is List ? value : null;
}

class AccountConsumptionItem {
  final String? color;
  final String? name;
  final double? percentage;
  final double? value;

  AccountConsumptionItem({
    this.color,
    this.name,
    this.percentage,
    this.value
  });

  factory AccountConsumptionItem.fromJson(Map<String, dynamic> json) {
    return AccountConsumptionItem(
      color: json['color']?.toString(),
      name: json['name']?.toString(),
      percentage: json['percentage'] is num ? json['percentage'].toDouble() : null,
      value: json['value'] is num ? json['value'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'color': color,
      'name': name,
      'percentage': percentage,
      'value': value,
    };
  }
}

class AccountInvoiceSettings {
  final String? invoiceType;
  final String? orgFull;
  final String? paymentMethod;
  final String? taxId;

  AccountInvoiceSettings({
    this.invoiceType,
    this.orgFull,
    this.paymentMethod,
    this.taxId
  });

  factory AccountInvoiceSettings.fromJson(Map<String, dynamic> json) {
    return AccountInvoiceSettings(
      invoiceType: json['invoiceType']?.toString(),
      orgFull: json['orgFull']?.toString(),
      paymentMethod: json['paymentMethod']?.toString(),
      taxId: json['taxId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'invoiceType': invoiceType,
      'orgFull': orgFull,
      'paymentMethod': paymentMethod,
      'taxId': taxId,
    };
  }
}

class AccountLoginLog {
  final String? device;
  final String? ip;
  final String? location;
  final String? status;
  final String? time;

  AccountLoginLog({
    this.device,
    this.ip,
    this.location,
    this.status,
    this.time
  });

  factory AccountLoginLog.fromJson(Map<String, dynamic> json) {
    return AccountLoginLog(
      device: json['device']?.toString(),
      ip: json['ip']?.toString(),
      location: json['location']?.toString(),
      status: json['status']?.toString(),
      time: json['time']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'device': device,
      'ip': ip,
      'location': location,
      'status': status,
      'time': time,
    };
  }
}

class AccountPointsExchangeRateRetrieveResult {
  final String? code;
  final CommercePointsExchangeRateResponse? data;
  final String? message;
  final String? msg;

  AccountPointsExchangeRateRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsExchangeRateRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsExchangeRateRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommercePointsExchangeRateResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsExchangesCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  AccountPointsExchangesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsExchangesCreateResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsExchangesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsExchangesRetrieveResult {
  final String? code;
  final CommerceWalletTransactionItem? data;
  final String? message;
  final String? msg;

  AccountPointsExchangesRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsExchangesRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsExchangesRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceWalletTransactionItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsExchangesRulesListResult {
  final String? code;
  final List<CommerceExchangeRuleItem>? data;
  final String? message;
  final String? msg;

  AccountPointsExchangesRulesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsExchangesRulesListResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsExchangesRulesListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceExchangeRuleItem.fromJson(map);
      })())
            .whereType<CommerceExchangeRuleItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsHistoryListResult {
  final String? code;
  final List<CommercePointsHistoryItem>? data;
  final String? message;
  final String? msg;

  AccountPointsHistoryListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsHistoryListResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsHistoryListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommercePointsHistoryItem.fromJson(map);
      })())
            .whereType<CommercePointsHistoryItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsRechargesCreateResult {
  final String? code;
  final SubmitRechargeResponse? data;
  final String? message;
  final String? msg;

  AccountPointsRechargesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsRechargesCreateResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsRechargesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SubmitRechargeResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsRechargesOrdersCancelResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  AccountPointsRechargesOrdersCancelResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsRechargesOrdersCancelResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsRechargesOrdersCancelResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsRechargesOrdersRetrieveResult {
  final String? code;
  final CheckoutStatusResponse? data;
  final String? message;
  final String? msg;

  AccountPointsRechargesOrdersRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsRechargesOrdersRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsRechargesOrdersRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CheckoutStatusResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsRechargesPackagesListResult {
  final String? code;
  final List<RechargePackage>? data;
  final String? message;
  final String? msg;

  AccountPointsRechargesPackagesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsRechargesPackagesListResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsRechargesPackagesListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RechargePackage.fromJson(map);
      })())
            .whereType<RechargePackage>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsRechargesRecordsListResult {
  final String? code;
  final List<BillingRechargeHistoryItem>? data;
  final String? message;
  final String? msg;

  AccountPointsRechargesRecordsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsRechargesRecordsListResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsRechargesRecordsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : BillingRechargeHistoryItem.fromJson(map);
      })())
            .whereType<BillingRechargeHistoryItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsRetrieveResult {
  final String? code;
  final CommercePointsBalanceResponse? data;
  final String? message;
  final String? msg;

  AccountPointsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommercePointsBalanceResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountPointsTransfersCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  AccountPointsTransfersCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountPointsTransfersCreateResult.fromJson(Map<String, dynamic> json) {
    return AccountPointsTransfersCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountSecuritySummary {
  final int? ipWhitelistCount;
  final bool? mfaEnabled;
  final int? qpsLimit;

  AccountSecuritySummary({
    this.ipWhitelistCount,
    this.mfaEnabled,
    this.qpsLimit
  });

  factory AccountSecuritySummary.fromJson(Map<String, dynamic> json) {
    return AccountSecuritySummary(
      ipWhitelistCount: json['ipWhitelistCount'] is int ? json['ipWhitelistCount'] : null,
      mfaEnabled: json['mfaEnabled'] is bool ? json['mfaEnabled'] : null,
      qpsLimit: json['qpsLimit'] is int ? json['qpsLimit'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'ipWhitelistCount': ipWhitelistCount,
      'mfaEnabled': mfaEnabled,
      'qpsLimit': qpsLimit,
    };
  }
}

class AccountSummaryResponse {
  final double? availableCredits;
  final List<AccountConsumptionItem>? consumptionByService;
  final String? email;
  final int? estDaysRemaining;
  final String? id;
  final AccountInvoiceSettings? invoiceSettings;
  final bool? isVerified;
  final List<AccountLoginLog>? loginLogs;
  final double? monthlyConsumption;
  final String? name;
  final String? organization;
  final AccountSecuritySummary? security;
  final String? tier;

  AccountSummaryResponse({
    this.availableCredits,
    this.consumptionByService,
    this.email,
    this.estDaysRemaining,
    this.id,
    this.invoiceSettings,
    this.isVerified,
    this.loginLogs,
    this.monthlyConsumption,
    this.name,
    this.organization,
    this.security,
    this.tier
  });

  factory AccountSummaryResponse.fromJson(Map<String, dynamic> json) {
    return AccountSummaryResponse(
      availableCredits: json['availableCredits'] is num ? json['availableCredits'].toDouble() : null,
      consumptionByService: (() {
        final list = _sdkworkAsList(json['consumptionByService']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AccountConsumptionItem.fromJson(map);
      })())
            .whereType<AccountConsumptionItem>()
            .toList();
      })(),
      email: json['email']?.toString(),
      estDaysRemaining: json['estDaysRemaining'] is int ? json['estDaysRemaining'] : null,
      id: json['id']?.toString(),
      invoiceSettings: (() {
        final map = _sdkworkAsMap(json['invoiceSettings']);
        return map == null ? null : AccountInvoiceSettings.fromJson(map);
      })(),
      isVerified: json['isVerified'] is bool ? json['isVerified'] : null,
      loginLogs: (() {
        final list = _sdkworkAsList(json['loginLogs']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AccountLoginLog.fromJson(map);
      })())
            .whereType<AccountLoginLog>()
            .toList();
      })(),
      monthlyConsumption: json['monthlyConsumption'] is num ? json['monthlyConsumption'].toDouble() : null,
      name: json['name']?.toString(),
      organization: json['organization']?.toString(),
      security: (() {
        final map = _sdkworkAsMap(json['security']);
        return map == null ? null : AccountSecuritySummary.fromJson(map);
      })(),
      tier: json['tier']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'availableCredits': availableCredits,
      'consumptionByService': consumptionByService?.map((item) => item.toJson()).toList(),
      'email': email,
      'estDaysRemaining': estDaysRemaining,
      'id': id,
      'invoiceSettings': invoiceSettings?.toJson(),
      'isVerified': isVerified,
      'loginLogs': loginLogs?.map((item) => item.toJson()).toList(),
      'monthlyConsumption': monthlyConsumption,
      'name': name,
      'organization': organization,
      'security': security?.toJson(),
      'tier': tier,
    };
  }
}

class AccountSummaryRetrieveResult {
  final String? code;
  final AccountSummaryResponse? data;
  final String? message;
  final String? msg;

  AccountSummaryRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountSummaryRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AccountSummaryRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AccountSummaryResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountTokensDeductionsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  AccountTokensDeductionsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountTokensDeductionsCreateResult.fromJson(Map<String, dynamic> json) {
    return AccountTokensDeductionsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AccountTokensRetrieveResult {
  final String? code;
  final CommerceTokenBalanceResponse? data;
  final String? message;
  final String? msg;

  AccountTokensRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AccountTokensRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AccountTokensRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceTokenBalanceResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AiBillingMeterRecord {
  final String? aggregationMode;
  final bool? allowNegativeQuantity;
  final String? billingMode;
  final String? canonicalPriceItemType;
  final String? createdAt;
  final String? dataScope;
  final String? defaultUnit;
  final String? defaultUnitSize;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? displayName;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? meterCode;
  final String? modality;
  final String? organizationId;
  final int? quantityPrecision;
  final String? quantitySource;
  final String? resultSelector;
  final int? sortOrder;
  final String? status;
  final bool? supportsExpression;
  final bool? supportsTier;
  final String? tenantId;
  final String? updatedAt;
  final String? usageType;
  final String? uuid;
  final String? version;

  AiBillingMeterRecord({
    this.aggregationMode,
    this.allowNegativeQuantity,
    this.billingMode,
    this.canonicalPriceItemType,
    this.createdAt,
    this.dataScope,
    this.defaultUnit,
    this.defaultUnitSize,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.displayName,
    this.id,
    this.metadata,
    this.meterCode,
    this.modality,
    this.organizationId,
    this.quantityPrecision,
    this.quantitySource,
    this.resultSelector,
    this.sortOrder,
    this.status,
    this.supportsExpression,
    this.supportsTier,
    this.tenantId,
    this.updatedAt,
    this.usageType,
    this.uuid,
    this.version
  });

  factory AiBillingMeterRecord.fromJson(Map<String, dynamic> json) {
    return AiBillingMeterRecord(
      aggregationMode: json['aggregation_mode']?.toString(),
      allowNegativeQuantity: json['allow_negative_quantity'] is bool ? json['allow_negative_quantity'] : null,
      billingMode: json['billing_mode']?.toString(),
      canonicalPriceItemType: json['canonical_price_item_type']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultUnit: json['default_unit']?.toString(),
      defaultUnitSize: json['default_unit_size']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      displayName: json['display_name']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      meterCode: json['meter_code']?.toString(),
      modality: json['modality']?.toString(),
      organizationId: json['organization_id']?.toString(),
      quantityPrecision: json['quantity_precision'] is int ? json['quantity_precision'] : null,
      quantitySource: json['quantity_source']?.toString(),
      resultSelector: json['result_selector']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      supportsExpression: json['supports_expression'] is bool ? json['supports_expression'] : null,
      supportsTier: json['supports_tier'] is bool ? json['supports_tier'] : null,
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      usageType: json['usage_type']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aggregation_mode': aggregationMode,
      'allow_negative_quantity': allowNegativeQuantity,
      'billing_mode': billingMode,
      'canonical_price_item_type': canonicalPriceItemType,
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_unit': defaultUnit,
      'default_unit_size': defaultUnitSize,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'display_name': displayName,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'meter_code': meterCode,
      'modality': modality,
      'organization_id': organizationId,
      'quantity_precision': quantityPrecision,
      'quantity_source': quantitySource,
      'result_selector': resultSelector,
      'sort_order': sortOrder,
      'status': status,
      'supports_expression': supportsExpression,
      'supports_tier': supportsTier,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'usage_type': usageType,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiGenerationAssetActionRecord {
  final Map<String, dynamic>? actionParams;
  final String? actionType;
  final String? assetId;
  final String? clientIpHash;
  final String? clientIpRegion;
  final String? completedAt;
  final String? createdAt;
  final String? failureCode;
  final String? id;
  final String? jobId;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? requestId;
  final String? resultAssetId;
  final String? retentionUntil;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userAgentHash;
  final String? userId;
  final String? uuid;

  AiGenerationAssetActionRecord({
    this.actionParams,
    this.actionType,
    this.assetId,
    this.clientIpHash,
    this.clientIpRegion,
    this.completedAt,
    this.createdAt,
    this.failureCode,
    this.id,
    this.jobId,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.requestId,
    this.resultAssetId,
    this.retentionUntil,
    this.status,
    this.tenantId,
    this.traceId,
    this.userAgentHash,
    this.userId,
    this.uuid
  });

  factory AiGenerationAssetActionRecord.fromJson(Map<String, dynamic> json) {
    return AiGenerationAssetActionRecord(
      actionParams: (() {
        final map = _sdkworkAsMap(json['action_params']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      actionType: json['action_type']?.toString(),
      assetId: json['asset_id']?.toString(),
      clientIpHash: json['client_ip_hash']?.toString(),
      clientIpRegion: json['client_ip_region']?.toString(),
      completedAt: json['completed_at']?.toString(),
      createdAt: json['created_at']?.toString(),
      failureCode: json['failure_code']?.toString(),
      id: json['id']?.toString(),
      jobId: json['job_id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      requestId: json['request_id']?.toString(),
      resultAssetId: json['result_asset_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userAgentHash: json['user_agent_hash']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'action_params': actionParams?.map((key, item) => MapEntry(key, item)),
      'action_type': actionType,
      'asset_id': assetId,
      'client_ip_hash': clientIpHash,
      'client_ip_region': clientIpRegion,
      'completed_at': completedAt,
      'created_at': createdAt,
      'failure_code': failureCode,
      'id': id,
      'job_id': jobId,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'request_id': requestId,
      'result_asset_id': resultAssetId,
      'retention_until': retentionUntil,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_agent_hash': userAgentHash,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class AiGenerationAssetRecord {
  final int? activeIndex;
  final String? assetType;
  final String? assetUrl;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? downloadCount;
  final String? durationSeconds;
  final String? expireAt;
  final bool? favorite;
  final String? fileSize;
  final int? height;
  final String? id;
  final String? jobId;
  final String? lastAccessedAt;
  final Map<String, dynamic>? metadata;
  final String? mimeType;
  final String? modelSnapshot;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final Map<String, dynamic>? parameterSnapshot;
  final String? promptSnapshot;
  final String? shareTokenHash;
  final bool? shared;
  final String? status;
  final String? storageKey;
  final String? storageProvider;
  final String? tenantId;
  final String? thumbnailUrl;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;
  final String? visibility;
  final int? width;

  AiGenerationAssetRecord({
    this.activeIndex,
    this.assetType,
    this.assetUrl,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.downloadCount,
    this.durationSeconds,
    this.expireAt,
    this.favorite,
    this.fileSize,
    this.height,
    this.id,
    this.jobId,
    this.lastAccessedAt,
    this.metadata,
    this.mimeType,
    this.modelSnapshot,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.parameterSnapshot,
    this.promptSnapshot,
    this.shareTokenHash,
    this.shared,
    this.status,
    this.storageKey,
    this.storageProvider,
    this.tenantId,
    this.thumbnailUrl,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version,
    this.visibility,
    this.width
  });

  factory AiGenerationAssetRecord.fromJson(Map<String, dynamic> json) {
    return AiGenerationAssetRecord(
      activeIndex: json['active_index'] is int ? json['active_index'] : null,
      assetType: json['asset_type']?.toString(),
      assetUrl: json['asset_url']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      downloadCount: json['download_count']?.toString(),
      durationSeconds: json['duration_seconds']?.toString(),
      expireAt: json['expire_at']?.toString(),
      favorite: json['favorite'] is bool ? json['favorite'] : null,
      fileSize: json['file_size']?.toString(),
      height: json['height'] is int ? json['height'] : null,
      id: json['id']?.toString(),
      jobId: json['job_id']?.toString(),
      lastAccessedAt: json['last_accessed_at']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      mimeType: json['mime_type']?.toString(),
      modelSnapshot: json['model_snapshot']?.toString(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      parameterSnapshot: (() {
        final map = _sdkworkAsMap(json['parameter_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      promptSnapshot: json['prompt_snapshot']?.toString(),
      shareTokenHash: json['share_token_hash']?.toString(),
      shared: json['shared'] is bool ? json['shared'] : null,
      status: json['status']?.toString(),
      storageKey: json['storage_key']?.toString(),
      storageProvider: json['storage_provider']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      thumbnailUrl: json['thumbnail_url']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      visibility: json['visibility']?.toString(),
      width: json['width'] is int ? json['width'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'active_index': activeIndex,
      'asset_type': assetType,
      'asset_url': assetUrl,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'download_count': downloadCount,
      'duration_seconds': durationSeconds,
      'expire_at': expireAt,
      'favorite': favorite,
      'file_size': fileSize,
      'height': height,
      'id': id,
      'job_id': jobId,
      'last_accessed_at': lastAccessedAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mime_type': mimeType,
      'model_snapshot': modelSnapshot,
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'parameter_snapshot': parameterSnapshot?.map((key, item) => MapEntry(key, item)),
      'prompt_snapshot': promptSnapshot,
      'share_token_hash': shareTokenHash,
      'shared': shared,
      'status': status,
      'storage_key': storageKey,
      'storage_provider': storageProvider,
      'tenant_id': tenantId,
      'thumbnail_url': thumbnailUrl,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
      'visibility': visibility,
      'width': width,
    };
  }
}

class AiGenerationJobRecord {
  final String? channelId;
  final String? completedAt;
  final String? createdAt;
  final String? failureCode;
  final String? failureMessageMasked;
  final String? id;
  final Map<String, dynamic>? inputAssetIds;
  final String? jobType;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? modality;
  final String? model;
  final String? negativePrompt;
  final String? organizationId;
  final Map<String, dynamic>? parameterSnapshot;
  final String? payloadHash;
  final int? progressPercent;
  final String? prompt;
  final String? providerId;
  final String? requestId;
  final String? retentionUntil;
  final String? sessionId;
  final String? startedAt;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? usageFactId;
  final String? userId;
  final String? uuid;

  AiGenerationJobRecord({
    this.channelId,
    this.completedAt,
    this.createdAt,
    this.failureCode,
    this.failureMessageMasked,
    this.id,
    this.inputAssetIds,
    this.jobType,
    this.legalHold,
    this.metadata,
    this.modality,
    this.model,
    this.negativePrompt,
    this.organizationId,
    this.parameterSnapshot,
    this.payloadHash,
    this.progressPercent,
    this.prompt,
    this.providerId,
    this.requestId,
    this.retentionUntil,
    this.sessionId,
    this.startedAt,
    this.status,
    this.tenantId,
    this.traceId,
    this.usageFactId,
    this.userId,
    this.uuid
  });

  factory AiGenerationJobRecord.fromJson(Map<String, dynamic> json) {
    return AiGenerationJobRecord(
      channelId: json['channel_id']?.toString(),
      completedAt: json['completed_at']?.toString(),
      createdAt: json['created_at']?.toString(),
      failureCode: json['failure_code']?.toString(),
      failureMessageMasked: json['failure_message_masked']?.toString(),
      id: json['id']?.toString(),
      inputAssetIds: (() {
        final map = _sdkworkAsMap(json['input_asset_ids']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      jobType: json['job_type']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modality: json['modality']?.toString(),
      model: json['model']?.toString(),
      negativePrompt: json['negative_prompt']?.toString(),
      organizationId: json['organization_id']?.toString(),
      parameterSnapshot: (() {
        final map = _sdkworkAsMap(json['parameter_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      payloadHash: json['payload_hash']?.toString(),
      progressPercent: json['progress_percent'] is int ? json['progress_percent'] : null,
      prompt: json['prompt']?.toString(),
      providerId: json['provider_id']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      sessionId: json['session_id']?.toString(),
      startedAt: json['started_at']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      usageFactId: json['usage_fact_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channel_id': channelId,
      'completed_at': completedAt,
      'created_at': createdAt,
      'failure_code': failureCode,
      'failure_message_masked': failureMessageMasked,
      'id': id,
      'input_asset_ids': inputAssetIds?.map((key, item) => MapEntry(key, item)),
      'job_type': jobType,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modality': modality,
      'model': model,
      'negative_prompt': negativePrompt,
      'organization_id': organizationId,
      'parameter_snapshot': parameterSnapshot?.map((key, item) => MapEntry(key, item)),
      'payload_hash': payloadHash,
      'progress_percent': progressPercent,
      'prompt': prompt,
      'provider_id': providerId,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'session_id': sessionId,
      'started_at': startedAt,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'usage_fact_id': usageFactId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class AiGenerationSessionRecord {
  final String? activeModality;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final Map<String, dynamic>? filterConfig;
  final String? id;
  final String? lastOpenedAt;
  final String? lastPrompt;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final Map<String, dynamic>? selectedModels;
  final String? sessionCode;
  final String? status;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;

  AiGenerationSessionRecord({
    this.activeModality,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.filterConfig,
    this.id,
    this.lastOpenedAt,
    this.lastPrompt,
    this.metadata,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.selectedModels,
    this.sessionCode,
    this.status,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version
  });

  factory AiGenerationSessionRecord.fromJson(Map<String, dynamic> json) {
    return AiGenerationSessionRecord(
      activeModality: json['active_modality']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      filterConfig: (() {
        final map = _sdkworkAsMap(json['filter_config']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      lastOpenedAt: json['last_opened_at']?.toString(),
      lastPrompt: json['last_prompt']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      selectedModels: (() {
        final map = _sdkworkAsMap(json['selected_models']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      sessionCode: json['session_code']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'active_modality': activeModality,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'filter_config': filterConfig?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'last_opened_at': lastOpenedAt,
      'last_prompt': lastPrompt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'selected_models': selectedModels?.map((key, item) => MapEntry(key, item)),
      'session_code': sessionCode,
      'status': status,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiModelCapabilityRecord {
  final String? capability;
  final String? capabilityCode;
  final String? catalogKey;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final Map<String, dynamic>? endpointFormats;
  final String? id;
  final Map<String, dynamic>? inputModalities;
  final String? limitUnit;
  final String? limitValue;
  final Map<String, dynamic>? metadata;
  final String? modality;
  final String? model;
  final String? modelId;
  final String? organizationId;
  final Map<String, dynamic>? outputModalities;
  final String? parameterName;
  final Map<String, dynamic>? parameterSchema;
  final String? regionCode;
  final String? schemaVersion;
  final int? sortOrder;
  final String? status;
  final bool? supported;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? version;

  AiModelCapabilityRecord({
    this.capability,
    this.capabilityCode,
    this.catalogKey,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.endpointFormats,
    this.id,
    this.inputModalities,
    this.limitUnit,
    this.limitValue,
    this.metadata,
    this.modality,
    this.model,
    this.modelId,
    this.organizationId,
    this.outputModalities,
    this.parameterName,
    this.parameterSchema,
    this.regionCode,
    this.schemaVersion,
    this.sortOrder,
    this.status,
    this.supported,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.version
  });

  factory AiModelCapabilityRecord.fromJson(Map<String, dynamic> json) {
    return AiModelCapabilityRecord(
      capability: json['capability']?.toString(),
      capabilityCode: json['capability_code']?.toString(),
      catalogKey: json['catalog_key']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      endpointFormats: (() {
        final map = _sdkworkAsMap(json['endpoint_formats']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      inputModalities: (() {
        final map = _sdkworkAsMap(json['input_modalities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      limitUnit: json['limit_unit']?.toString(),
      limitValue: json['limit_value']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modality: json['modality']?.toString(),
      model: json['model']?.toString(),
      modelId: json['model_id']?.toString(),
      organizationId: json['organization_id']?.toString(),
      outputModalities: (() {
        final map = _sdkworkAsMap(json['output_modalities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      parameterName: json['parameter_name']?.toString(),
      parameterSchema: (() {
        final map = _sdkworkAsMap(json['parameter_schema']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      regionCode: json['region_code']?.toString(),
      schemaVersion: json['schema_version']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      supported: json['supported'] is bool ? json['supported'] : null,
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'capability': capability,
      'capability_code': capabilityCode,
      'catalog_key': catalogKey,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'endpoint_formats': endpointFormats?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'input_modalities': inputModalities?.map((key, item) => MapEntry(key, item)),
      'limit_unit': limitUnit,
      'limit_value': limitValue,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modality': modality,
      'model': model,
      'model_id': modelId,
      'organization_id': organizationId,
      'output_modalities': outputModalities?.map((key, item) => MapEntry(key, item)),
      'parameter_name': parameterName,
      'parameter_schema': parameterSchema?.map((key, item) => MapEntry(key, item)),
      'region_code': regionCode,
      'schema_version': schemaVersion,
      'sort_order': sortOrder,
      'status': status,
      'supported': supported,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'version': version,
    };
  }
}

class AiModelCatalogSourceRecord {
  final String? catalogVersion;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? errorMessageMasked;
  final String? id;
  final String? lastObservedAt;
  final String? lastSuccessAt;
  final Map<String, dynamic>? metadata;
  final String? normalizedPayloadHash;
  final String? organizationId;
  final String? parserKind;
  final String? providerCode;
  final String? rawPayloadRef;
  final String? refreshIntervalSeconds;
  final String? regionCode;
  final String? schemaVersion;
  final String? sourceCode;
  final String? sourceHash;
  final String? sourceKind;
  final String? sourceName;
  final String? sourceUrl;
  final String? status;
  final String? tenantId;
  final String? trustLevel;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? version;

  AiModelCatalogSourceRecord({
    this.catalogVersion,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.errorMessageMasked,
    this.id,
    this.lastObservedAt,
    this.lastSuccessAt,
    this.metadata,
    this.normalizedPayloadHash,
    this.organizationId,
    this.parserKind,
    this.providerCode,
    this.rawPayloadRef,
    this.refreshIntervalSeconds,
    this.regionCode,
    this.schemaVersion,
    this.sourceCode,
    this.sourceHash,
    this.sourceKind,
    this.sourceName,
    this.sourceUrl,
    this.status,
    this.tenantId,
    this.trustLevel,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.version
  });

  factory AiModelCatalogSourceRecord.fromJson(Map<String, dynamic> json) {
    return AiModelCatalogSourceRecord(
      catalogVersion: json['catalog_version']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      errorMessageMasked: json['error_message_masked']?.toString(),
      id: json['id']?.toString(),
      lastObservedAt: json['last_observed_at']?.toString(),
      lastSuccessAt: json['last_success_at']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      normalizedPayloadHash: json['normalized_payload_hash']?.toString(),
      organizationId: json['organization_id']?.toString(),
      parserKind: json['parser_kind']?.toString(),
      providerCode: json['provider_code']?.toString(),
      rawPayloadRef: json['raw_payload_ref']?.toString(),
      refreshIntervalSeconds: json['refresh_interval_seconds']?.toString(),
      regionCode: json['region_code']?.toString(),
      schemaVersion: json['schema_version']?.toString(),
      sourceCode: json['source_code']?.toString(),
      sourceHash: json['source_hash']?.toString(),
      sourceKind: json['source_kind']?.toString(),
      sourceName: json['source_name']?.toString(),
      sourceUrl: json['source_url']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      trustLevel: json['trust_level']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'catalog_version': catalogVersion,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'error_message_masked': errorMessageMasked,
      'id': id,
      'last_observed_at': lastObservedAt,
      'last_success_at': lastSuccessAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'normalized_payload_hash': normalizedPayloadHash,
      'organization_id': organizationId,
      'parser_kind': parserKind,
      'provider_code': providerCode,
      'raw_payload_ref': rawPayloadRef,
      'refresh_interval_seconds': refreshIntervalSeconds,
      'region_code': regionCode,
      'schema_version': schemaVersion,
      'source_code': sourceCode,
      'source_hash': sourceHash,
      'source_kind': sourceKind,
      'source_name': sourceName,
      'source_url': sourceUrl,
      'status': status,
      'tenant_id': tenantId,
      'trust_level': trustLevel,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'version': version,
    };
  }
}

class AiModelCatalogSyncRunRecord {
  final String? acceptedCount;
  final String? catalogVersion;
  final Map<String, dynamic>? changeSummary;
  final String? createdAt;
  final String? errorMessageMasked;
  final String? finishedAt;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? observedAt;
  final String? observedMeterCount;
  final String? observedModelCount;
  final String? observedPriceCount;
  final String? observedVendorCount;
  final String? organizationId;
  final String? payloadHash;
  final String? providerCode;
  final String? regionCode;
  final String? rejectedCount;
  final String? requestId;
  final String? retentionUntil;
  final String? runStatus;
  final String? skippedCount;
  final String? sourceCode;
  final String? sourceHash;
  final String? sourceId;
  final String? sourceType;
  final String? sourceVersion;
  final String? startedAt;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userId;
  final String? uuid;
  final String? vendorCode;

  AiModelCatalogSyncRunRecord({
    this.acceptedCount,
    this.catalogVersion,
    this.changeSummary,
    this.createdAt,
    this.errorMessageMasked,
    this.finishedAt,
    this.id,
    this.legalHold,
    this.metadata,
    this.observedAt,
    this.observedMeterCount,
    this.observedModelCount,
    this.observedPriceCount,
    this.observedVendorCount,
    this.organizationId,
    this.payloadHash,
    this.providerCode,
    this.regionCode,
    this.rejectedCount,
    this.requestId,
    this.retentionUntil,
    this.runStatus,
    this.skippedCount,
    this.sourceCode,
    this.sourceHash,
    this.sourceId,
    this.sourceType,
    this.sourceVersion,
    this.startedAt,
    this.status,
    this.tenantId,
    this.traceId,
    this.userId,
    this.uuid,
    this.vendorCode
  });

  factory AiModelCatalogSyncRunRecord.fromJson(Map<String, dynamic> json) {
    return AiModelCatalogSyncRunRecord(
      acceptedCount: json['accepted_count']?.toString(),
      catalogVersion: json['catalog_version']?.toString(),
      changeSummary: (() {
        final map = _sdkworkAsMap(json['change_summary']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      createdAt: json['created_at']?.toString(),
      errorMessageMasked: json['error_message_masked']?.toString(),
      finishedAt: json['finished_at']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      observedAt: json['observed_at']?.toString(),
      observedMeterCount: json['observed_meter_count']?.toString(),
      observedModelCount: json['observed_model_count']?.toString(),
      observedPriceCount: json['observed_price_count']?.toString(),
      observedVendorCount: json['observed_vendor_count']?.toString(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      providerCode: json['provider_code']?.toString(),
      regionCode: json['region_code']?.toString(),
      rejectedCount: json['rejected_count']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      runStatus: json['run_status']?.toString(),
      skippedCount: json['skipped_count']?.toString(),
      sourceCode: json['source_code']?.toString(),
      sourceHash: json['source_hash']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      startedAt: json['started_at']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accepted_count': acceptedCount,
      'catalog_version': catalogVersion,
      'change_summary': changeSummary?.map((key, item) => MapEntry(key, item)),
      'created_at': createdAt,
      'error_message_masked': errorMessageMasked,
      'finished_at': finishedAt,
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'observed_at': observedAt,
      'observed_meter_count': observedMeterCount,
      'observed_model_count': observedModelCount,
      'observed_price_count': observedPriceCount,
      'observed_vendor_count': observedVendorCount,
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'provider_code': providerCode,
      'region_code': regionCode,
      'rejected_count': rejectedCount,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'run_status': runStatus,
      'skipped_count': skippedCount,
      'source_code': sourceCode,
      'source_hash': sourceHash,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'started_at': startedAt,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
      'vendor_code': vendorCode,
    };
  }
}

class AiModelFamilyRecord {
  final String? colorToken;
  final String? createdAt;
  final String? dataScope;
  final String? defaultModel;
  final String? defaultModelId;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? displayName;
  final String? docsUrl;
  final String? familyCode;
  final String? familyType;
  final String? iconUrl;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? modelCount;
  final String? organizationId;
  final String? primaryModality;
  final String? regionCode;
  final int? sortOrder;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? vendorId;
  final String? version;

  AiModelFamilyRecord({
    this.colorToken,
    this.createdAt,
    this.dataScope,
    this.defaultModel,
    this.defaultModelId,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.displayName,
    this.docsUrl,
    this.familyCode,
    this.familyType,
    this.iconUrl,
    this.id,
    this.metadata,
    this.modelCount,
    this.organizationId,
    this.primaryModality,
    this.regionCode,
    this.sortOrder,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.vendorId,
    this.version
  });

  factory AiModelFamilyRecord.fromJson(Map<String, dynamic> json) {
    return AiModelFamilyRecord(
      colorToken: json['color_token']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultModel: json['default_model']?.toString(),
      defaultModelId: json['default_model_id']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      displayName: json['display_name']?.toString(),
      docsUrl: json['docs_url']?.toString(),
      familyCode: json['family_code']?.toString(),
      familyType: json['family_type']?.toString(),
      iconUrl: json['icon_url']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modelCount: json['model_count']?.toString(),
      organizationId: json['organization_id']?.toString(),
      primaryModality: json['primary_modality']?.toString(),
      regionCode: json['region_code']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      vendorId: json['vendor_id']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'color_token': colorToken,
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_model': defaultModel,
      'default_model_id': defaultModelId,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'display_name': displayName,
      'docs_url': docsUrl,
      'family_code': familyCode,
      'family_type': familyType,
      'icon_url': iconUrl,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model_count': modelCount,
      'organization_id': organizationId,
      'primary_modality': primaryModality,
      'region_code': regionCode,
      'sort_order': sortOrder,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'vendor_id': vendorId,
      'version': version,
    };
  }
}

class AiModelPricingRecord {
  final String? billingMeterCode;
  final String? billingMeterId;
  final String? billingMode;
  final String? billingType;
  final String? catalogKey;
  final String? channelId;
  final String? createdAt;
  final String? currency;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? id;
  final String? importSnapshotId;
  final String? includedQuantity;
  final String? markupAmount;
  final Map<String, dynamic>? metadata;
  final String? meteringMode;
  final String? minChargeAmount;
  final String? minimumQuantity;
  final String? model;
  final String? modelId;
  final String? observedAt;
  final String? organizationId;
  final String? platformCode;
  final String? priceItemType;
  final String? priceOrigin;
  final String? priceSide;
  final String? priceVersion;
  final String? pricingFormulaMode;
  final String? pricingPlanCode;
  final String? pricingPlanId;
  final String? pricingScope;
  final String? pricingScopeId;
  final int? priority;
  final String? providerCode;
  final String? providerModel;
  final String? publishedAt;
  final String? quantityFormula;
  final String? quantitySource;
  final String? quantityStep;
  final String? referenceMultiplier;
  final String? referencePriceId;
  final String? referencePriceSide;
  final String? regionCode;
  final String? resultSelector;
  final String? roundingMode;
  final String? serviceTier;
  final String? sourceHash;
  final String? sourcePriceId;
  final String? sourceUrl;
  final String? status;
  final String? tenantId;
  final String? unit;
  final String? unitPrice;
  final String? unitSize;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? version;

  AiModelPricingRecord({
    this.billingMeterCode,
    this.billingMeterId,
    this.billingMode,
    this.billingType,
    this.catalogKey,
    this.channelId,
    this.createdAt,
    this.currency,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.id,
    this.importSnapshotId,
    this.includedQuantity,
    this.markupAmount,
    this.metadata,
    this.meteringMode,
    this.minChargeAmount,
    this.minimumQuantity,
    this.model,
    this.modelId,
    this.observedAt,
    this.organizationId,
    this.platformCode,
    this.priceItemType,
    this.priceOrigin,
    this.priceSide,
    this.priceVersion,
    this.pricingFormulaMode,
    this.pricingPlanCode,
    this.pricingPlanId,
    this.pricingScope,
    this.pricingScopeId,
    this.priority,
    this.providerCode,
    this.providerModel,
    this.publishedAt,
    this.quantityFormula,
    this.quantitySource,
    this.quantityStep,
    this.referenceMultiplier,
    this.referencePriceId,
    this.referencePriceSide,
    this.regionCode,
    this.resultSelector,
    this.roundingMode,
    this.serviceTier,
    this.sourceHash,
    this.sourcePriceId,
    this.sourceUrl,
    this.status,
    this.tenantId,
    this.unit,
    this.unitPrice,
    this.unitSize,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.version
  });

  factory AiModelPricingRecord.fromJson(Map<String, dynamic> json) {
    return AiModelPricingRecord(
      billingMeterCode: json['billing_meter_code']?.toString(),
      billingMeterId: json['billing_meter_id']?.toString(),
      billingMode: json['billing_mode']?.toString(),
      billingType: json['billing_type']?.toString(),
      catalogKey: json['catalog_key']?.toString(),
      channelId: json['channel_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      id: json['id']?.toString(),
      importSnapshotId: json['import_snapshot_id']?.toString(),
      includedQuantity: json['included_quantity']?.toString(),
      markupAmount: json['markup_amount']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      meteringMode: json['metering_mode']?.toString(),
      minChargeAmount: json['min_charge_amount']?.toString(),
      minimumQuantity: json['minimum_quantity']?.toString(),
      model: json['model']?.toString(),
      modelId: json['model_id']?.toString(),
      observedAt: json['observed_at']?.toString(),
      organizationId: json['organization_id']?.toString(),
      platformCode: json['platform_code']?.toString(),
      priceItemType: json['price_item_type']?.toString(),
      priceOrigin: json['price_origin']?.toString(),
      priceSide: json['price_side']?.toString(),
      priceVersion: json['price_version']?.toString(),
      pricingFormulaMode: json['pricing_formula_mode']?.toString(),
      pricingPlanCode: json['pricing_plan_code']?.toString(),
      pricingPlanId: json['pricing_plan_id']?.toString(),
      pricingScope: json['pricing_scope']?.toString(),
      pricingScopeId: json['pricing_scope_id']?.toString(),
      priority: json['priority'] is int ? json['priority'] : null,
      providerCode: json['provider_code']?.toString(),
      providerModel: json['provider_model']?.toString(),
      publishedAt: json['published_at']?.toString(),
      quantityFormula: json['quantity_formula']?.toString(),
      quantitySource: json['quantity_source']?.toString(),
      quantityStep: json['quantity_step']?.toString(),
      referenceMultiplier: json['reference_multiplier']?.toString(),
      referencePriceId: json['reference_price_id']?.toString(),
      referencePriceSide: json['reference_price_side']?.toString(),
      regionCode: json['region_code']?.toString(),
      resultSelector: json['result_selector']?.toString(),
      roundingMode: json['rounding_mode']?.toString(),
      serviceTier: json['service_tier']?.toString(),
      sourceHash: json['source_hash']?.toString(),
      sourcePriceId: json['source_price_id']?.toString(),
      sourceUrl: json['source_url']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      unit: json['unit']?.toString(),
      unitPrice: json['unit_price']?.toString(),
      unitSize: json['unit_size']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'billing_meter_code': billingMeterCode,
      'billing_meter_id': billingMeterId,
      'billing_mode': billingMode,
      'billing_type': billingType,
      'catalog_key': catalogKey,
      'channel_id': channelId,
      'created_at': createdAt,
      'currency': currency,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'id': id,
      'import_snapshot_id': importSnapshotId,
      'included_quantity': includedQuantity,
      'markup_amount': markupAmount,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'metering_mode': meteringMode,
      'min_charge_amount': minChargeAmount,
      'minimum_quantity': minimumQuantity,
      'model': model,
      'model_id': modelId,
      'observed_at': observedAt,
      'organization_id': organizationId,
      'platform_code': platformCode,
      'price_item_type': priceItemType,
      'price_origin': priceOrigin,
      'price_side': priceSide,
      'price_version': priceVersion,
      'pricing_formula_mode': pricingFormulaMode,
      'pricing_plan_code': pricingPlanCode,
      'pricing_plan_id': pricingPlanId,
      'pricing_scope': pricingScope,
      'pricing_scope_id': pricingScopeId,
      'priority': priority,
      'provider_code': providerCode,
      'provider_model': providerModel,
      'published_at': publishedAt,
      'quantity_formula': quantityFormula,
      'quantity_source': quantitySource,
      'quantity_step': quantityStep,
      'reference_multiplier': referenceMultiplier,
      'reference_price_id': referencePriceId,
      'reference_price_side': referencePriceSide,
      'region_code': regionCode,
      'result_selector': resultSelector,
      'rounding_mode': roundingMode,
      'service_tier': serviceTier,
      'source_hash': sourceHash,
      'source_price_id': sourcePriceId,
      'source_url': sourceUrl,
      'status': status,
      'tenant_id': tenantId,
      'unit': unit,
      'unit_price': unitPrice,
      'unit_size': unitSize,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'version': version,
    };
  }
}

class AiModelRankSnapshotRecord {
  final String? baseVolume;
  final String? catalogKey;
  final String? colorToken;
  final String? contextSizeText;
  final String? costAmount;
  final int? costIndicator;
  final String? createdAt;
  final String? currency;
  final String? id;
  final bool? isNew;
  final int? latencyP50Ms;
  final int? latencyP95Ms;
  final String? licenseType;
  final Map<String, dynamic>? metadata;
  final String? modality;
  final String? model;
  final String? modelId;
  final String? organizationId;
  final int? previousRankNo;
  final String? pricingText;
  final String? providerCode;
  final int? rankNo;
  final Map<String, dynamic>? rankPayload;
  final String? rankScope;
  final String? rebuildVersion;
  final String? regionCode;
  final String? requestCount;
  final String? snapshotDate;
  final String? snapshotPeriod;
  final String? sourceId;
  final String? sourceType;
  final String? sourceVersion;
  final String? status;
  final Map<String, dynamic>? strengths;
  final String? successRate;
  final String? tenantId;
  final String? tokenCount;
  final String? trendScore;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? vendorNameSnapshot;
  final String? winRate;

  AiModelRankSnapshotRecord({
    this.baseVolume,
    this.catalogKey,
    this.colorToken,
    this.contextSizeText,
    this.costAmount,
    this.costIndicator,
    this.createdAt,
    this.currency,
    this.id,
    this.isNew,
    this.latencyP50Ms,
    this.latencyP95Ms,
    this.licenseType,
    this.metadata,
    this.modality,
    this.model,
    this.modelId,
    this.organizationId,
    this.previousRankNo,
    this.pricingText,
    this.providerCode,
    this.rankNo,
    this.rankPayload,
    this.rankScope,
    this.rebuildVersion,
    this.regionCode,
    this.requestCount,
    this.snapshotDate,
    this.snapshotPeriod,
    this.sourceId,
    this.sourceType,
    this.sourceVersion,
    this.status,
    this.strengths,
    this.successRate,
    this.tenantId,
    this.tokenCount,
    this.trendScore,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.vendorNameSnapshot,
    this.winRate
  });

  factory AiModelRankSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return AiModelRankSnapshotRecord(
      baseVolume: json['base_volume']?.toString(),
      catalogKey: json['catalog_key']?.toString(),
      colorToken: json['color_token']?.toString(),
      contextSizeText: json['context_size_text']?.toString(),
      costAmount: json['cost_amount']?.toString(),
      costIndicator: json['cost_indicator'] is int ? json['cost_indicator'] : null,
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      id: json['id']?.toString(),
      isNew: json['is_new'] is bool ? json['is_new'] : null,
      latencyP50Ms: json['latency_p50_ms'] is int ? json['latency_p50_ms'] : null,
      latencyP95Ms: json['latency_p95_ms'] is int ? json['latency_p95_ms'] : null,
      licenseType: json['license_type']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modality: json['modality']?.toString(),
      model: json['model']?.toString(),
      modelId: json['model_id']?.toString(),
      organizationId: json['organization_id']?.toString(),
      previousRankNo: json['previous_rank_no'] is int ? json['previous_rank_no'] : null,
      pricingText: json['pricing_text']?.toString(),
      providerCode: json['provider_code']?.toString(),
      rankNo: json['rank_no'] is int ? json['rank_no'] : null,
      rankPayload: (() {
        final map = _sdkworkAsMap(json['rank_payload']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      rankScope: json['rank_scope']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      regionCode: json['region_code']?.toString(),
      requestCount: json['request_count']?.toString(),
      snapshotDate: json['snapshot_date']?.toString(),
      snapshotPeriod: json['snapshot_period']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      status: json['status']?.toString(),
      strengths: (() {
        final map = _sdkworkAsMap(json['strengths']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      successRate: json['success_rate']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      tokenCount: json['token_count']?.toString(),
      trendScore: json['trend_score']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      vendorNameSnapshot: json['vendor_name_snapshot']?.toString(),
      winRate: json['win_rate']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'base_volume': baseVolume,
      'catalog_key': catalogKey,
      'color_token': colorToken,
      'context_size_text': contextSizeText,
      'cost_amount': costAmount,
      'cost_indicator': costIndicator,
      'created_at': createdAt,
      'currency': currency,
      'id': id,
      'is_new': isNew,
      'latency_p50_ms': latencyP50Ms,
      'latency_p95_ms': latencyP95Ms,
      'license_type': licenseType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modality': modality,
      'model': model,
      'model_id': modelId,
      'organization_id': organizationId,
      'previous_rank_no': previousRankNo,
      'pricing_text': pricingText,
      'provider_code': providerCode,
      'rank_no': rankNo,
      'rank_payload': rankPayload?.map((key, item) => MapEntry(key, item)),
      'rank_scope': rankScope,
      'rebuild_version': rebuildVersion,
      'region_code': regionCode,
      'request_count': requestCount,
      'snapshot_date': snapshotDate,
      'snapshot_period': snapshotPeriod,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'status': status,
      'strengths': strengths?.map((key, item) => MapEntry(key, item)),
      'success_rate': successRate,
      'tenant_id': tenantId,
      'token_count': tokenCount,
      'trend_score': trendScore,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'vendor_name_snapshot': vendorNameSnapshot,
      'win_rate': winRate,
    };
  }
}

class AiModelRecord {
  final String? apiFormat;
  final Map<String, dynamic>? capabilities;
  final String? capability;
  final String? capabilityIntro;
  final String? catalogKey;
  final String? colorToken;
  final String? contextTokens;
  final String? createdAt;
  final String? dataScope;
  final String? defaultPricingId;
  final String? deletedAt;
  final String? deletedBy;
  final String? deprecatedAt;
  final String? description;
  final String? displayName;
  final String? docsUrl;
  final String? familyCode;
  final String? familyId;
  final String? iconUrl;
  final String? id;
  final Map<String, dynamic>? inputModalities;
  final String? licenseType;
  final Map<String, dynamic>? limitations;
  final int? maxDurationSeconds;
  final String? maxInputTokens;
  final String? maxOutputTokens;
  final Map<String, dynamic>? metadata;
  final Map<String, dynamic>? modalities;
  final String? model;
  final Map<String, dynamic>? modelAliases;
  final String? modelFamily;
  final String? modelVersion;
  final String? organizationId;
  final Map<String, dynamic>? outputModalities;
  final Map<String, dynamic>? performanceProfile;
  final String? providerHint;
  final String? rankScore;
  final String? regionCode;
  final String? releaseStage;
  final String? replacementModel;
  final String? retiredAt;
  final String? routingState;
  final String? shelfState;
  final String? status;
  final Map<String, dynamic>? supportedLanguages;
  final bool? supportsJsonSchema;
  final bool? supportsStreaming;
  final bool? supportsTools;
  final String? tenantId;
  final String? trainingDataCutoff;
  final String? updatedAt;
  final Map<String, dynamic>? useCases;
  final String? uuid;
  final String? vendorCode;
  final String? vendorId;
  final String? vendorNameSnapshot;
  final String? version;

  AiModelRecord({
    this.apiFormat,
    this.capabilities,
    this.capability,
    this.capabilityIntro,
    this.catalogKey,
    this.colorToken,
    this.contextTokens,
    this.createdAt,
    this.dataScope,
    this.defaultPricingId,
    this.deletedAt,
    this.deletedBy,
    this.deprecatedAt,
    this.description,
    this.displayName,
    this.docsUrl,
    this.familyCode,
    this.familyId,
    this.iconUrl,
    this.id,
    this.inputModalities,
    this.licenseType,
    this.limitations,
    this.maxDurationSeconds,
    this.maxInputTokens,
    this.maxOutputTokens,
    this.metadata,
    this.modalities,
    this.model,
    this.modelAliases,
    this.modelFamily,
    this.modelVersion,
    this.organizationId,
    this.outputModalities,
    this.performanceProfile,
    this.providerHint,
    this.rankScore,
    this.regionCode,
    this.releaseStage,
    this.replacementModel,
    this.retiredAt,
    this.routingState,
    this.shelfState,
    this.status,
    this.supportedLanguages,
    this.supportsJsonSchema,
    this.supportsStreaming,
    this.supportsTools,
    this.tenantId,
    this.trainingDataCutoff,
    this.updatedAt,
    this.useCases,
    this.uuid,
    this.vendorCode,
    this.vendorId,
    this.vendorNameSnapshot,
    this.version
  });

  factory AiModelRecord.fromJson(Map<String, dynamic> json) {
    return AiModelRecord(
      apiFormat: json['api_format']?.toString(),
      capabilities: (() {
        final map = _sdkworkAsMap(json['capabilities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      capability: json['capability']?.toString(),
      capabilityIntro: json['capability_intro']?.toString(),
      catalogKey: json['catalog_key']?.toString(),
      colorToken: json['color_token']?.toString(),
      contextTokens: json['context_tokens']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultPricingId: json['default_pricing_id']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      deprecatedAt: json['deprecated_at']?.toString(),
      description: json['description']?.toString(),
      displayName: json['display_name']?.toString(),
      docsUrl: json['docs_url']?.toString(),
      familyCode: json['family_code']?.toString(),
      familyId: json['family_id']?.toString(),
      iconUrl: json['icon_url']?.toString(),
      id: json['id']?.toString(),
      inputModalities: (() {
        final map = _sdkworkAsMap(json['input_modalities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      licenseType: json['license_type']?.toString(),
      limitations: (() {
        final map = _sdkworkAsMap(json['limitations']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      maxDurationSeconds: json['max_duration_seconds'] is int ? json['max_duration_seconds'] : null,
      maxInputTokens: json['max_input_tokens']?.toString(),
      maxOutputTokens: json['max_output_tokens']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modalities: (() {
        final map = _sdkworkAsMap(json['modalities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      modelAliases: (() {
        final map = _sdkworkAsMap(json['model_aliases']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modelFamily: json['model_family']?.toString(),
      modelVersion: json['model_version']?.toString(),
      organizationId: json['organization_id']?.toString(),
      outputModalities: (() {
        final map = _sdkworkAsMap(json['output_modalities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      performanceProfile: (() {
        final map = _sdkworkAsMap(json['performance_profile']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      providerHint: json['provider_hint']?.toString(),
      rankScore: json['rank_score']?.toString(),
      regionCode: json['region_code']?.toString(),
      releaseStage: json['release_stage']?.toString(),
      replacementModel: json['replacement_model']?.toString(),
      retiredAt: json['retired_at']?.toString(),
      routingState: json['routing_state']?.toString(),
      shelfState: json['shelf_state']?.toString(),
      status: json['status']?.toString(),
      supportedLanguages: (() {
        final map = _sdkworkAsMap(json['supported_languages']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      supportsJsonSchema: json['supports_json_schema'] is bool ? json['supports_json_schema'] : null,
      supportsStreaming: json['supports_streaming'] is bool ? json['supports_streaming'] : null,
      supportsTools: json['supports_tools'] is bool ? json['supports_tools'] : null,
      tenantId: json['tenant_id']?.toString(),
      trainingDataCutoff: json['training_data_cutoff']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      useCases: (() {
        final map = _sdkworkAsMap(json['use_cases']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      vendorId: json['vendor_id']?.toString(),
      vendorNameSnapshot: json['vendor_name_snapshot']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'api_format': apiFormat,
      'capabilities': capabilities?.map((key, item) => MapEntry(key, item)),
      'capability': capability,
      'capability_intro': capabilityIntro,
      'catalog_key': catalogKey,
      'color_token': colorToken,
      'context_tokens': contextTokens,
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_pricing_id': defaultPricingId,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'deprecated_at': deprecatedAt,
      'description': description,
      'display_name': displayName,
      'docs_url': docsUrl,
      'family_code': familyCode,
      'family_id': familyId,
      'icon_url': iconUrl,
      'id': id,
      'input_modalities': inputModalities?.map((key, item) => MapEntry(key, item)),
      'license_type': licenseType,
      'limitations': limitations?.map((key, item) => MapEntry(key, item)),
      'max_duration_seconds': maxDurationSeconds,
      'max_input_tokens': maxInputTokens,
      'max_output_tokens': maxOutputTokens,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modalities': modalities?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'model_aliases': modelAliases?.map((key, item) => MapEntry(key, item)),
      'model_family': modelFamily,
      'model_version': modelVersion,
      'organization_id': organizationId,
      'output_modalities': outputModalities?.map((key, item) => MapEntry(key, item)),
      'performance_profile': performanceProfile?.map((key, item) => MapEntry(key, item)),
      'provider_hint': providerHint,
      'rank_score': rankScore,
      'region_code': regionCode,
      'release_stage': releaseStage,
      'replacement_model': replacementModel,
      'retired_at': retiredAt,
      'routing_state': routingState,
      'shelf_state': shelfState,
      'status': status,
      'supported_languages': supportedLanguages?.map((key, item) => MapEntry(key, item)),
      'supports_json_schema': supportsJsonSchema,
      'supports_streaming': supportsStreaming,
      'supports_tools': supportsTools,
      'tenant_id': tenantId,
      'training_data_cutoff': trainingDataCutoff,
      'updated_at': updatedAt,
      'use_cases': useCases?.map((key, item) => MapEntry(key, item)),
      'uuid': uuid,
      'vendor_code': vendorCode,
      'vendor_id': vendorId,
      'vendor_name_snapshot': vendorNameSnapshot,
      'version': version,
    };
  }
}

class AiModelVendorRecord {
  final Map<String, dynamic>? capabilities;
  final String? colorToken;
  final String? countryRegion;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? displayName;
  final String? docsUrl;
  final String? iconUrl;
  final String? id;
  final String? legalName;
  final String? logoUrl;
  final Map<String, dynamic>? metadata;
  final Map<String, dynamic>? modelFamilies;
  final bool? openSource;
  final String? organizationId;
  final int? sortOrder;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? vendorType;
  final String? version;
  final String? websiteUrl;

  AiModelVendorRecord({
    this.capabilities,
    this.colorToken,
    this.countryRegion,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.displayName,
    this.docsUrl,
    this.iconUrl,
    this.id,
    this.legalName,
    this.logoUrl,
    this.metadata,
    this.modelFamilies,
    this.openSource,
    this.organizationId,
    this.sortOrder,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.vendorType,
    this.version,
    this.websiteUrl
  });

  factory AiModelVendorRecord.fromJson(Map<String, dynamic> json) {
    return AiModelVendorRecord(
      capabilities: (() {
        final map = _sdkworkAsMap(json['capabilities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      colorToken: json['color_token']?.toString(),
      countryRegion: json['country_region']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      displayName: json['display_name']?.toString(),
      docsUrl: json['docs_url']?.toString(),
      iconUrl: json['icon_url']?.toString(),
      id: json['id']?.toString(),
      legalName: json['legal_name']?.toString(),
      logoUrl: json['logo_url']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modelFamilies: (() {
        final map = _sdkworkAsMap(json['model_families']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      openSource: json['open_source'] is bool ? json['open_source'] : null,
      organizationId: json['organization_id']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      vendorType: json['vendor_type']?.toString(),
      version: json['version']?.toString(),
      websiteUrl: json['website_url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'capabilities': capabilities?.map((key, item) => MapEntry(key, item)),
      'color_token': colorToken,
      'country_region': countryRegion,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'display_name': displayName,
      'docs_url': docsUrl,
      'icon_url': iconUrl,
      'id': id,
      'legal_name': legalName,
      'logo_url': logoUrl,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model_families': modelFamilies?.map((key, item) => MapEntry(key, item)),
      'open_source': openSource,
      'organization_id': organizationId,
      'sort_order': sortOrder,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'vendor_type': vendorType,
      'version': version,
      'website_url': websiteUrl,
    };
  }
}

class AiModelVendorRegionRecord {
  final String? billingCurrency;
  final String? billingJurisdiction;
  final Map<String, dynamic>? capabilities;
  final String? countryRegion;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? displayName;
  final String? docsUrl;
  final String? id;
  final String? legalName;
  final String? marketScope;
  final Map<String, dynamic>? metadata;
  final bool? openSource;
  final Map<String, dynamic>? operatingRegions;
  final String? organizationId;
  final String? regionCode;
  final int? sortOrder;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? vendorId;
  final String? version;
  final String? websiteUrl;

  AiModelVendorRegionRecord({
    this.billingCurrency,
    this.billingJurisdiction,
    this.capabilities,
    this.countryRegion,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.displayName,
    this.docsUrl,
    this.id,
    this.legalName,
    this.marketScope,
    this.metadata,
    this.openSource,
    this.operatingRegions,
    this.organizationId,
    this.regionCode,
    this.sortOrder,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.vendorId,
    this.version,
    this.websiteUrl
  });

  factory AiModelVendorRegionRecord.fromJson(Map<String, dynamic> json) {
    return AiModelVendorRegionRecord(
      billingCurrency: json['billing_currency']?.toString(),
      billingJurisdiction: json['billing_jurisdiction']?.toString(),
      capabilities: (() {
        final map = _sdkworkAsMap(json['capabilities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      countryRegion: json['country_region']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      displayName: json['display_name']?.toString(),
      docsUrl: json['docs_url']?.toString(),
      id: json['id']?.toString(),
      legalName: json['legal_name']?.toString(),
      marketScope: json['market_scope']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      openSource: json['open_source'] is bool ? json['open_source'] : null,
      operatingRegions: (() {
        final map = _sdkworkAsMap(json['operating_regions']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      regionCode: json['region_code']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      vendorId: json['vendor_id']?.toString(),
      version: json['version']?.toString(),
      websiteUrl: json['website_url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'billing_currency': billingCurrency,
      'billing_jurisdiction': billingJurisdiction,
      'capabilities': capabilities?.map((key, item) => MapEntry(key, item)),
      'country_region': countryRegion,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'display_name': displayName,
      'docs_url': docsUrl,
      'id': id,
      'legal_name': legalName,
      'market_scope': marketScope,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'open_source': openSource,
      'operating_regions': operatingRegions?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'region_code': regionCode,
      'sort_order': sortOrder,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'vendor_id': vendorId,
      'version': version,
      'website_url': websiteUrl,
    };
  }
}

class AiPricingImportSnapshotRecord {
  final String? acceptedCount;
  final String? createdAt;
  final String? currency;
  final String? dataFormat;
  final String? errorMessageMasked;
  final String? id;
  final String? importSource;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? normalizedPayloadHash;
  final String? observedAt;
  final String? organizationId;
  final String? payloadHash;
  final String? publishedAt;
  final String? rawPayloadRef;
  final String? rejectedCount;
  final String? requestId;
  final String? retentionUntil;
  final String? rowCount;
  final String? schemaVersion;
  final String? sourceHash;
  final String? sourceName;
  final String? sourceUrl;
  final String? sourceVersion;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? upstreamCommit;
  final String? userId;
  final String? uuid;

  AiPricingImportSnapshotRecord({
    this.acceptedCount,
    this.createdAt,
    this.currency,
    this.dataFormat,
    this.errorMessageMasked,
    this.id,
    this.importSource,
    this.legalHold,
    this.metadata,
    this.normalizedPayloadHash,
    this.observedAt,
    this.organizationId,
    this.payloadHash,
    this.publishedAt,
    this.rawPayloadRef,
    this.rejectedCount,
    this.requestId,
    this.retentionUntil,
    this.rowCount,
    this.schemaVersion,
    this.sourceHash,
    this.sourceName,
    this.sourceUrl,
    this.sourceVersion,
    this.status,
    this.tenantId,
    this.traceId,
    this.upstreamCommit,
    this.userId,
    this.uuid
  });

  factory AiPricingImportSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return AiPricingImportSnapshotRecord(
      acceptedCount: json['accepted_count']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      dataFormat: json['data_format']?.toString(),
      errorMessageMasked: json['error_message_masked']?.toString(),
      id: json['id']?.toString(),
      importSource: json['import_source']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      normalizedPayloadHash: json['normalized_payload_hash']?.toString(),
      observedAt: json['observed_at']?.toString(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      publishedAt: json['published_at']?.toString(),
      rawPayloadRef: json['raw_payload_ref']?.toString(),
      rejectedCount: json['rejected_count']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      rowCount: json['row_count']?.toString(),
      schemaVersion: json['schema_version']?.toString(),
      sourceHash: json['source_hash']?.toString(),
      sourceName: json['source_name']?.toString(),
      sourceUrl: json['source_url']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      upstreamCommit: json['upstream_commit']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accepted_count': acceptedCount,
      'created_at': createdAt,
      'currency': currency,
      'data_format': dataFormat,
      'error_message_masked': errorMessageMasked,
      'id': id,
      'import_source': importSource,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'normalized_payload_hash': normalizedPayloadHash,
      'observed_at': observedAt,
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'published_at': publishedAt,
      'raw_payload_ref': rawPayloadRef,
      'rejected_count': rejectedCount,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'row_count': rowCount,
      'schema_version': schemaVersion,
      'source_hash': sourceHash,
      'source_name': sourceName,
      'source_url': sourceUrl,
      'source_version': sourceVersion,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'upstream_commit': upstreamCommit,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class AiPricingPlanBindingRecord {
  final String? bindingSource;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? multiplierOverride;
  final String? organizationId;
  final String? pricingPlanCode;
  final String? pricingPlanId;
  final int? priority;
  final String? quotaPolicyId;
  final String? rpmOverride;
  final String? status;
  final String? subjectCode;
  final String? subjectId;
  final String? subjectType;
  final String? tenantId;
  final String? tpmOverride;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  AiPricingPlanBindingRecord({
    this.bindingSource,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.id,
    this.metadata,
    this.multiplierOverride,
    this.organizationId,
    this.pricingPlanCode,
    this.pricingPlanId,
    this.priority,
    this.quotaPolicyId,
    this.rpmOverride,
    this.status,
    this.subjectCode,
    this.subjectId,
    this.subjectType,
    this.tenantId,
    this.tpmOverride,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory AiPricingPlanBindingRecord.fromJson(Map<String, dynamic> json) {
    return AiPricingPlanBindingRecord(
      bindingSource: json['binding_source']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      multiplierOverride: json['multiplier_override']?.toString(),
      organizationId: json['organization_id']?.toString(),
      pricingPlanCode: json['pricing_plan_code']?.toString(),
      pricingPlanId: json['pricing_plan_id']?.toString(),
      priority: json['priority'] is int ? json['priority'] : null,
      quotaPolicyId: json['quota_policy_id']?.toString(),
      rpmOverride: json['rpm_override']?.toString(),
      status: json['status']?.toString(),
      subjectCode: json['subject_code']?.toString(),
      subjectId: json['subject_id']?.toString(),
      subjectType: json['subject_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      tpmOverride: json['tpm_override']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'binding_source': bindingSource,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'multiplier_override': multiplierOverride,
      'organization_id': organizationId,
      'pricing_plan_code': pricingPlanCode,
      'pricing_plan_id': pricingPlanId,
      'priority': priority,
      'quota_policy_id': quotaPolicyId,
      'rpm_override': rpmOverride,
      'status': status,
      'subject_code': subjectCode,
      'subject_id': subjectId,
      'subject_type': subjectType,
      'tenant_id': tenantId,
      'tpm_override': tpmOverride,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiPricingPlanRecord {
  final String? basePriceSide;
  final String? basePricingScope;
  final String? billingMode;
  final String? createdAt;
  final String? currency;
  final String? dataScope;
  final String? defaultMarkupAmount;
  final String? defaultMultiplier;
  final String? defaultReferencePriceId;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? fallbackMode;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? minChargeAmount;
  final String? organizationId;
  final String? planCode;
  final String? planName;
  final String? planScope;
  final String? priceVersion;
  final int? priority;
  final String? roundingMode;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  AiPricingPlanRecord({
    this.basePriceSide,
    this.basePricingScope,
    this.billingMode,
    this.createdAt,
    this.currency,
    this.dataScope,
    this.defaultMarkupAmount,
    this.defaultMultiplier,
    this.defaultReferencePriceId,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.effectiveFrom,
    this.effectiveTo,
    this.fallbackMode,
    this.id,
    this.metadata,
    this.minChargeAmount,
    this.organizationId,
    this.planCode,
    this.planName,
    this.planScope,
    this.priceVersion,
    this.priority,
    this.roundingMode,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory AiPricingPlanRecord.fromJson(Map<String, dynamic> json) {
    return AiPricingPlanRecord(
      basePriceSide: json['base_price_side']?.toString(),
      basePricingScope: json['base_pricing_scope']?.toString(),
      billingMode: json['billing_mode']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultMarkupAmount: json['default_markup_amount']?.toString(),
      defaultMultiplier: json['default_multiplier']?.toString(),
      defaultReferencePriceId: json['default_reference_price_id']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      fallbackMode: json['fallback_mode']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      minChargeAmount: json['min_charge_amount']?.toString(),
      organizationId: json['organization_id']?.toString(),
      planCode: json['plan_code']?.toString(),
      planName: json['plan_name']?.toString(),
      planScope: json['plan_scope']?.toString(),
      priceVersion: json['price_version']?.toString(),
      priority: json['priority'] is int ? json['priority'] : null,
      roundingMode: json['rounding_mode']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'base_price_side': basePriceSide,
      'base_pricing_scope': basePricingScope,
      'billing_mode': billingMode,
      'created_at': createdAt,
      'currency': currency,
      'data_scope': dataScope,
      'default_markup_amount': defaultMarkupAmount,
      'default_multiplier': defaultMultiplier,
      'default_reference_price_id': defaultReferencePriceId,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'fallback_mode': fallbackMode,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'min_charge_amount': minChargeAmount,
      'organization_id': organizationId,
      'plan_code': planCode,
      'plan_name': planName,
      'plan_scope': planScope,
      'price_version': priceVersion,
      'priority': priority,
      'rounding_mode': roundingMode,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiPricingRuleRecord {
  final String? billingMeterCode;
  final String? billingMeterId;
  final String? billingMode;
  final String? billingType;
  final String? capabilityCode;
  final String? channelId;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? expression;
  final String? expressionHash;
  final String? fallbackMode;
  final String? familyCode;
  final String? formulaMode;
  final String? id;
  final String? includedQuantity;
  final String? markupAmount;
  final String? matchType;
  final Map<String, dynamic>? metadata;
  final String? meteringMode;
  final String? minimumQuantity;
  final String? model;
  final String? modelId;
  final String? multiplier;
  final String? organizationId;
  final String? platformCode;
  final String? priceItemType;
  final String? priceSide;
  final String? pricingPlanCode;
  final String? pricingPlanId;
  final int? priority;
  final String? providerCode;
  final String? providerModel;
  final String? quantityFormula;
  final String? quantitySource;
  final String? quantityStep;
  final String? referencePriceSide;
  final String? referencePricingId;
  final String? referencePricingScope;
  final String? region;
  final String? resultSelector;
  final String? ruleCode;
  final String? ruleName;
  final String? serviceTier;
  final String? status;
  final String? tenantId;
  final String? unit;
  final String? unitPriceOverride;
  final String? unitSize;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? version;

  AiPricingRuleRecord({
    this.billingMeterCode,
    this.billingMeterId,
    this.billingMode,
    this.billingType,
    this.capabilityCode,
    this.channelId,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.expression,
    this.expressionHash,
    this.fallbackMode,
    this.familyCode,
    this.formulaMode,
    this.id,
    this.includedQuantity,
    this.markupAmount,
    this.matchType,
    this.metadata,
    this.meteringMode,
    this.minimumQuantity,
    this.model,
    this.modelId,
    this.multiplier,
    this.organizationId,
    this.platformCode,
    this.priceItemType,
    this.priceSide,
    this.pricingPlanCode,
    this.pricingPlanId,
    this.priority,
    this.providerCode,
    this.providerModel,
    this.quantityFormula,
    this.quantitySource,
    this.quantityStep,
    this.referencePriceSide,
    this.referencePricingId,
    this.referencePricingScope,
    this.region,
    this.resultSelector,
    this.ruleCode,
    this.ruleName,
    this.serviceTier,
    this.status,
    this.tenantId,
    this.unit,
    this.unitPriceOverride,
    this.unitSize,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.version
  });

  factory AiPricingRuleRecord.fromJson(Map<String, dynamic> json) {
    return AiPricingRuleRecord(
      billingMeterCode: json['billing_meter_code']?.toString(),
      billingMeterId: json['billing_meter_id']?.toString(),
      billingMode: json['billing_mode']?.toString(),
      billingType: json['billing_type']?.toString(),
      capabilityCode: json['capability_code']?.toString(),
      channelId: json['channel_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      expression: json['expression']?.toString(),
      expressionHash: json['expression_hash']?.toString(),
      fallbackMode: json['fallback_mode']?.toString(),
      familyCode: json['family_code']?.toString(),
      formulaMode: json['formula_mode']?.toString(),
      id: json['id']?.toString(),
      includedQuantity: json['included_quantity']?.toString(),
      markupAmount: json['markup_amount']?.toString(),
      matchType: json['match_type']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      meteringMode: json['metering_mode']?.toString(),
      minimumQuantity: json['minimum_quantity']?.toString(),
      model: json['model']?.toString(),
      modelId: json['model_id']?.toString(),
      multiplier: json['multiplier']?.toString(),
      organizationId: json['organization_id']?.toString(),
      platformCode: json['platform_code']?.toString(),
      priceItemType: json['price_item_type']?.toString(),
      priceSide: json['price_side']?.toString(),
      pricingPlanCode: json['pricing_plan_code']?.toString(),
      pricingPlanId: json['pricing_plan_id']?.toString(),
      priority: json['priority'] is int ? json['priority'] : null,
      providerCode: json['provider_code']?.toString(),
      providerModel: json['provider_model']?.toString(),
      quantityFormula: json['quantity_formula']?.toString(),
      quantitySource: json['quantity_source']?.toString(),
      quantityStep: json['quantity_step']?.toString(),
      referencePriceSide: json['reference_price_side']?.toString(),
      referencePricingId: json['reference_pricing_id']?.toString(),
      referencePricingScope: json['reference_pricing_scope']?.toString(),
      region: json['region']?.toString(),
      resultSelector: json['result_selector']?.toString(),
      ruleCode: json['rule_code']?.toString(),
      ruleName: json['rule_name']?.toString(),
      serviceTier: json['service_tier']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      unit: json['unit']?.toString(),
      unitPriceOverride: json['unit_price_override']?.toString(),
      unitSize: json['unit_size']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'billing_meter_code': billingMeterCode,
      'billing_meter_id': billingMeterId,
      'billing_mode': billingMode,
      'billing_type': billingType,
      'capability_code': capabilityCode,
      'channel_id': channelId,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'expression': expression,
      'expression_hash': expressionHash,
      'fallback_mode': fallbackMode,
      'family_code': familyCode,
      'formula_mode': formulaMode,
      'id': id,
      'included_quantity': includedQuantity,
      'markup_amount': markupAmount,
      'match_type': matchType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'metering_mode': meteringMode,
      'minimum_quantity': minimumQuantity,
      'model': model,
      'model_id': modelId,
      'multiplier': multiplier,
      'organization_id': organizationId,
      'platform_code': platformCode,
      'price_item_type': priceItemType,
      'price_side': priceSide,
      'pricing_plan_code': pricingPlanCode,
      'pricing_plan_id': pricingPlanId,
      'priority': priority,
      'provider_code': providerCode,
      'provider_model': providerModel,
      'quantity_formula': quantityFormula,
      'quantity_source': quantitySource,
      'quantity_step': quantityStep,
      'reference_price_side': referencePriceSide,
      'reference_pricing_id': referencePricingId,
      'reference_pricing_scope': referencePricingScope,
      'region': region,
      'result_selector': resultSelector,
      'rule_code': ruleCode,
      'rule_name': ruleName,
      'service_tier': serviceTier,
      'status': status,
      'tenant_id': tenantId,
      'unit': unit,
      'unit_price_override': unitPriceOverride,
      'unit_size': unitSize,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'version': version,
    };
  }
}

class AiPricingTierRecord {
  final String? audioUnitPrice;
  final String? billingMeterCode;
  final String? billingMeterId;
  final String? billingMode;
  final String? cacheReadUnitPrice;
  final String? cacheWriteUnitPrice;
  final String? createdAt;
  final String? currency;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? id;
  final String? imageUnitPrice;
  final String? includedQuantity;
  final String? inputUnitPrice;
  final String? maxQuantity;
  final Map<String, dynamic>? metadata;
  final String? minQuantity;
  final String? modelPricingId;
  final String? multiplier;
  final String? organizationId;
  final String? outputUnitPrice;
  final String? perRequestPrice;
  final String? priceItemType;
  final String? pricingRuleId;
  final String? quantityStep;
  final String? quantityUnit;
  final String? resultSelector;
  final int? sortOrder;
  final String? status;
  final String? tenantId;
  final String? tierCode;
  final String? tierLabel;
  final String? updatedAt;
  final String? uuid;
  final String? version;
  final String? videoUnitPrice;

  AiPricingTierRecord({
    this.audioUnitPrice,
    this.billingMeterCode,
    this.billingMeterId,
    this.billingMode,
    this.cacheReadUnitPrice,
    this.cacheWriteUnitPrice,
    this.createdAt,
    this.currency,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.id,
    this.imageUnitPrice,
    this.includedQuantity,
    this.inputUnitPrice,
    this.maxQuantity,
    this.metadata,
    this.minQuantity,
    this.modelPricingId,
    this.multiplier,
    this.organizationId,
    this.outputUnitPrice,
    this.perRequestPrice,
    this.priceItemType,
    this.pricingRuleId,
    this.quantityStep,
    this.quantityUnit,
    this.resultSelector,
    this.sortOrder,
    this.status,
    this.tenantId,
    this.tierCode,
    this.tierLabel,
    this.updatedAt,
    this.uuid,
    this.version,
    this.videoUnitPrice
  });

  factory AiPricingTierRecord.fromJson(Map<String, dynamic> json) {
    return AiPricingTierRecord(
      audioUnitPrice: json['audio_unit_price']?.toString(),
      billingMeterCode: json['billing_meter_code']?.toString(),
      billingMeterId: json['billing_meter_id']?.toString(),
      billingMode: json['billing_mode']?.toString(),
      cacheReadUnitPrice: json['cache_read_unit_price']?.toString(),
      cacheWriteUnitPrice: json['cache_write_unit_price']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      id: json['id']?.toString(),
      imageUnitPrice: json['image_unit_price']?.toString(),
      includedQuantity: json['included_quantity']?.toString(),
      inputUnitPrice: json['input_unit_price']?.toString(),
      maxQuantity: json['max_quantity']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      minQuantity: json['min_quantity']?.toString(),
      modelPricingId: json['model_pricing_id']?.toString(),
      multiplier: json['multiplier']?.toString(),
      organizationId: json['organization_id']?.toString(),
      outputUnitPrice: json['output_unit_price']?.toString(),
      perRequestPrice: json['per_request_price']?.toString(),
      priceItemType: json['price_item_type']?.toString(),
      pricingRuleId: json['pricing_rule_id']?.toString(),
      quantityStep: json['quantity_step']?.toString(),
      quantityUnit: json['quantity_unit']?.toString(),
      resultSelector: json['result_selector']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      tierCode: json['tier_code']?.toString(),
      tierLabel: json['tier_label']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      videoUnitPrice: json['video_unit_price']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio_unit_price': audioUnitPrice,
      'billing_meter_code': billingMeterCode,
      'billing_meter_id': billingMeterId,
      'billing_mode': billingMode,
      'cache_read_unit_price': cacheReadUnitPrice,
      'cache_write_unit_price': cacheWriteUnitPrice,
      'created_at': createdAt,
      'currency': currency,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'id': id,
      'image_unit_price': imageUnitPrice,
      'included_quantity': includedQuantity,
      'input_unit_price': inputUnitPrice,
      'max_quantity': maxQuantity,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'min_quantity': minQuantity,
      'model_pricing_id': modelPricingId,
      'multiplier': multiplier,
      'organization_id': organizationId,
      'output_unit_price': outputUnitPrice,
      'per_request_price': perRequestPrice,
      'price_item_type': priceItemType,
      'pricing_rule_id': pricingRuleId,
      'quantity_step': quantityStep,
      'quantity_unit': quantityUnit,
      'result_selector': resultSelector,
      'sort_order': sortOrder,
      'status': status,
      'tenant_id': tenantId,
      'tier_code': tierCode,
      'tier_label': tierLabel,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
      'video_unit_price': videoUnitPrice,
    };
  }
}

class AiQuotaPolicyRecord {
  final String? blockDurationSeconds;
  final String? burstLimit;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? exhaustedAt;
  final String? groupId;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? model;
  final String? name;
  final String? organizationId;
  final String? policyCode;
  final String? quotaLimit;
  final String? quotaPeriod;
  final String? quotaUnit;
  final String? requestsPerDay;
  final String? requestsPerMinute;
  final String? requestsPerSecond;
  final String? resetMode;
  final String? scopeId;
  final String? scopeType;
  final String? status;
  final String? subjectId;
  final String? subjectRefHash;
  final String? subjectRefMasked;
  final String? subjectType;
  final String? tenantId;
  final String? tokensPerMinute;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  AiQuotaPolicyRecord({
    this.blockDurationSeconds,
    this.burstLimit,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.exhaustedAt,
    this.groupId,
    this.id,
    this.metadata,
    this.model,
    this.name,
    this.organizationId,
    this.policyCode,
    this.quotaLimit,
    this.quotaPeriod,
    this.quotaUnit,
    this.requestsPerDay,
    this.requestsPerMinute,
    this.requestsPerSecond,
    this.resetMode,
    this.scopeId,
    this.scopeType,
    this.status,
    this.subjectId,
    this.subjectRefHash,
    this.subjectRefMasked,
    this.subjectType,
    this.tenantId,
    this.tokensPerMinute,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory AiQuotaPolicyRecord.fromJson(Map<String, dynamic> json) {
    return AiQuotaPolicyRecord(
      blockDurationSeconds: json['block_duration_seconds']?.toString(),
      burstLimit: json['burst_limit']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      exhaustedAt: json['exhausted_at']?.toString(),
      groupId: json['group_id']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      name: json['name']?.toString(),
      organizationId: json['organization_id']?.toString(),
      policyCode: json['policy_code']?.toString(),
      quotaLimit: json['quota_limit']?.toString(),
      quotaPeriod: json['quota_period']?.toString(),
      quotaUnit: json['quota_unit']?.toString(),
      requestsPerDay: json['requests_per_day']?.toString(),
      requestsPerMinute: json['requests_per_minute']?.toString(),
      requestsPerSecond: json['requests_per_second']?.toString(),
      resetMode: json['reset_mode']?.toString(),
      scopeId: json['scope_id']?.toString(),
      scopeType: json['scope_type']?.toString(),
      status: json['status']?.toString(),
      subjectId: json['subject_id']?.toString(),
      subjectRefHash: json['subject_ref_hash']?.toString(),
      subjectRefMasked: json['subject_ref_masked']?.toString(),
      subjectType: json['subject_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      tokensPerMinute: json['tokens_per_minute']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'block_duration_seconds': blockDurationSeconds,
      'burst_limit': burstLimit,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'exhausted_at': exhaustedAt,
      'group_id': groupId,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'name': name,
      'organization_id': organizationId,
      'policy_code': policyCode,
      'quota_limit': quotaLimit,
      'quota_period': quotaPeriod,
      'quota_unit': quotaUnit,
      'requests_per_day': requestsPerDay,
      'requests_per_minute': requestsPerMinute,
      'requests_per_second': requestsPerSecond,
      'reset_mode': resetMode,
      'scope_id': scopeId,
      'scope_type': scopeType,
      'status': status,
      'subject_id': subjectId,
      'subject_ref_hash': subjectRefHash,
      'subject_ref_masked': subjectRefMasked,
      'subject_type': subjectType,
      'tenant_id': tenantId,
      'tokens_per_minute': tokensPerMinute,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiRateLimitBucketRecord {
  final String? bucketKey;
  final String? createdAt;
  final String? currentCount;
  final String? currentTokens;
  final String? id;
  final String? lastRequestAt;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? quotaPolicyId;
  final String? rebuildVersion;
  final String? remainingCount;
  final String? remainingTokens;
  final String? sourceId;
  final String? sourceType;
  final String? sourceVersion;
  final String? status;
  final String? subjectId;
  final String? subjectType;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? windowEnd;
  final String? windowStart;

  AiRateLimitBucketRecord({
    this.bucketKey,
    this.createdAt,
    this.currentCount,
    this.currentTokens,
    this.id,
    this.lastRequestAt,
    this.metadata,
    this.organizationId,
    this.quotaPolicyId,
    this.rebuildVersion,
    this.remainingCount,
    this.remainingTokens,
    this.sourceId,
    this.sourceType,
    this.sourceVersion,
    this.status,
    this.subjectId,
    this.subjectType,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.windowEnd,
    this.windowStart
  });

  factory AiRateLimitBucketRecord.fromJson(Map<String, dynamic> json) {
    return AiRateLimitBucketRecord(
      bucketKey: json['bucket_key']?.toString(),
      createdAt: json['created_at']?.toString(),
      currentCount: json['current_count']?.toString(),
      currentTokens: json['current_tokens']?.toString(),
      id: json['id']?.toString(),
      lastRequestAt: json['last_request_at']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      quotaPolicyId: json['quota_policy_id']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      remainingCount: json['remaining_count']?.toString(),
      remainingTokens: json['remaining_tokens']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      status: json['status']?.toString(),
      subjectId: json['subject_id']?.toString(),
      subjectType: json['subject_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      windowEnd: json['window_end']?.toString(),
      windowStart: json['window_start']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bucket_key': bucketKey,
      'created_at': createdAt,
      'current_count': currentCount,
      'current_tokens': currentTokens,
      'id': id,
      'last_request_at': lastRequestAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'quota_policy_id': quotaPolicyId,
      'rebuild_version': rebuildVersion,
      'remaining_count': remainingCount,
      'remaining_tokens': remainingTokens,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'status': status,
      'subject_id': subjectId,
      'subject_type': subjectType,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'window_end': windowEnd,
      'window_start': windowStart,
    };
  }
}

class AiRequestTraceRecord {
  final String? apiKeyGroupId;
  final String? apiKeyGroupSnapshot;
  final String? apiKeyId;
  final String? apiKeyNameSnapshot;
  final int? attemptNo;
  final String? cachedTokens;
  final String? channelId;
  final String? channelNameSnapshot;
  final String? clientIpHash;
  final String? clientIpMasked;
  final String? clientIpRegion;
  final String? completionTokens;
  final String? createdAt;
  final String? decisionLogId;
  final String? endedAt;
  final String? endpoint;
  final String? errorMessageMasked;
  final String? errorType;
  final String? httpMethod;
  final int? httpStatus;
  final String? id;
  final int? latencyMs;
  final String? legacyApiKeyId;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? ownerId;
  final String? ownerNameSnapshot;
  final String? ownerType;
  final String? payloadHash;
  final String? promptTokens;
  final String? providerAccountId;
  final String? providerErrorCode;
  final String? providerId;
  final String? providerModel;
  final String? reasoningEffort;
  final String? requestBytes;
  final String? requestId;
  final String? requestPath;
  final String? requestPayloadHash;
  final String? requestedModel;
  final String? responseBytes;
  final String? responsePayloadHash;
  final String? retentionUntil;
  final String? startedAt;
  final String? status;
  final bool? streaming;
  final String? tenantId;
  final String? totalTokens;
  final String? traceId;
  final int? ttftMs;
  final String? userAgentHash;
  final String? userId;
  final String? uuid;

  AiRequestTraceRecord({
    this.apiKeyGroupId,
    this.apiKeyGroupSnapshot,
    this.apiKeyId,
    this.apiKeyNameSnapshot,
    this.attemptNo,
    this.cachedTokens,
    this.channelId,
    this.channelNameSnapshot,
    this.clientIpHash,
    this.clientIpMasked,
    this.clientIpRegion,
    this.completionTokens,
    this.createdAt,
    this.decisionLogId,
    this.endedAt,
    this.endpoint,
    this.errorMessageMasked,
    this.errorType,
    this.httpMethod,
    this.httpStatus,
    this.id,
    this.latencyMs,
    this.legacyApiKeyId,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.ownerId,
    this.ownerNameSnapshot,
    this.ownerType,
    this.payloadHash,
    this.promptTokens,
    this.providerAccountId,
    this.providerErrorCode,
    this.providerId,
    this.providerModel,
    this.reasoningEffort,
    this.requestBytes,
    this.requestId,
    this.requestPath,
    this.requestPayloadHash,
    this.requestedModel,
    this.responseBytes,
    this.responsePayloadHash,
    this.retentionUntil,
    this.startedAt,
    this.status,
    this.streaming,
    this.tenantId,
    this.totalTokens,
    this.traceId,
    this.ttftMs,
    this.userAgentHash,
    this.userId,
    this.uuid
  });

  factory AiRequestTraceRecord.fromJson(Map<String, dynamic> json) {
    return AiRequestTraceRecord(
      apiKeyGroupId: json['api_key_group_id']?.toString(),
      apiKeyGroupSnapshot: json['api_key_group_snapshot']?.toString(),
      apiKeyId: json['api_key_id']?.toString(),
      apiKeyNameSnapshot: json['api_key_name_snapshot']?.toString(),
      attemptNo: json['attempt_no'] is int ? json['attempt_no'] : null,
      cachedTokens: json['cached_tokens']?.toString(),
      channelId: json['channel_id']?.toString(),
      channelNameSnapshot: json['channel_name_snapshot']?.toString(),
      clientIpHash: json['client_ip_hash']?.toString(),
      clientIpMasked: json['client_ip_masked']?.toString(),
      clientIpRegion: json['client_ip_region']?.toString(),
      completionTokens: json['completion_tokens']?.toString(),
      createdAt: json['created_at']?.toString(),
      decisionLogId: json['decision_log_id']?.toString(),
      endedAt: json['ended_at']?.toString(),
      endpoint: json['endpoint']?.toString(),
      errorMessageMasked: json['error_message_masked']?.toString(),
      errorType: json['error_type']?.toString(),
      httpMethod: json['http_method']?.toString(),
      httpStatus: json['http_status'] is int ? json['http_status'] : null,
      id: json['id']?.toString(),
      latencyMs: json['latency_ms'] is int ? json['latency_ms'] : null,
      legacyApiKeyId: json['legacy_api_key_id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerNameSnapshot: json['owner_name_snapshot']?.toString(),
      ownerType: json['owner_type']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      promptTokens: json['prompt_tokens']?.toString(),
      providerAccountId: json['provider_account_id']?.toString(),
      providerErrorCode: json['provider_error_code']?.toString(),
      providerId: json['provider_id']?.toString(),
      providerModel: json['provider_model']?.toString(),
      reasoningEffort: json['reasoning_effort']?.toString(),
      requestBytes: json['request_bytes']?.toString(),
      requestId: json['request_id']?.toString(),
      requestPath: json['request_path']?.toString(),
      requestPayloadHash: json['request_payload_hash']?.toString(),
      requestedModel: json['requested_model']?.toString(),
      responseBytes: json['response_bytes']?.toString(),
      responsePayloadHash: json['response_payload_hash']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      startedAt: json['started_at']?.toString(),
      status: json['status']?.toString(),
      streaming: json['streaming'] is bool ? json['streaming'] : null,
      tenantId: json['tenant_id']?.toString(),
      totalTokens: json['total_tokens']?.toString(),
      traceId: json['trace_id']?.toString(),
      ttftMs: json['ttft_ms'] is int ? json['ttft_ms'] : null,
      userAgentHash: json['user_agent_hash']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'api_key_group_id': apiKeyGroupId,
      'api_key_group_snapshot': apiKeyGroupSnapshot,
      'api_key_id': apiKeyId,
      'api_key_name_snapshot': apiKeyNameSnapshot,
      'attempt_no': attemptNo,
      'cached_tokens': cachedTokens,
      'channel_id': channelId,
      'channel_name_snapshot': channelNameSnapshot,
      'client_ip_hash': clientIpHash,
      'client_ip_masked': clientIpMasked,
      'client_ip_region': clientIpRegion,
      'completion_tokens': completionTokens,
      'created_at': createdAt,
      'decision_log_id': decisionLogId,
      'ended_at': endedAt,
      'endpoint': endpoint,
      'error_message_masked': errorMessageMasked,
      'error_type': errorType,
      'http_method': httpMethod,
      'http_status': httpStatus,
      'id': id,
      'latency_ms': latencyMs,
      'legacy_api_key_id': legacyApiKeyId,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_name_snapshot': ownerNameSnapshot,
      'owner_type': ownerType,
      'payload_hash': payloadHash,
      'prompt_tokens': promptTokens,
      'provider_account_id': providerAccountId,
      'provider_error_code': providerErrorCode,
      'provider_id': providerId,
      'provider_model': providerModel,
      'reasoning_effort': reasoningEffort,
      'request_bytes': requestBytes,
      'request_id': requestId,
      'request_path': requestPath,
      'request_payload_hash': requestPayloadHash,
      'requested_model': requestedModel,
      'response_bytes': responseBytes,
      'response_payload_hash': responsePayloadHash,
      'retention_until': retentionUntil,
      'started_at': startedAt,
      'status': status,
      'streaming': streaming,
      'tenant_id': tenantId,
      'total_tokens': totalTokens,
      'trace_id': traceId,
      'ttft_ms': ttftMs,
      'user_agent_hash': userAgentHash,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class AiRoutingDecisionLogRecord {
  final String? apiKeyId;
  final Map<String, dynamic>? candidateSnapshot;
  final String? capability;
  final String? createdAt;
  final int? decisionLatencyMs;
  final String? decisionMode;
  final Map<String, dynamic>? decisionReason;
  final Map<String, dynamic>? fallbackChain;
  final String? id;
  final String? legacyApiKeyId;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? policyId;
  final String? profileId;
  final String? requestId;
  final String? requestedModel;
  final String? resolvedModel;
  final String? retentionUntil;
  final String? ruleId;
  final String? selectedAccountId;
  final String? selectedChannelId;
  final String? selectedProviderId;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userId;
  final String? uuid;

  AiRoutingDecisionLogRecord({
    this.apiKeyId,
    this.candidateSnapshot,
    this.capability,
    this.createdAt,
    this.decisionLatencyMs,
    this.decisionMode,
    this.decisionReason,
    this.fallbackChain,
    this.id,
    this.legacyApiKeyId,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.policyId,
    this.profileId,
    this.requestId,
    this.requestedModel,
    this.resolvedModel,
    this.retentionUntil,
    this.ruleId,
    this.selectedAccountId,
    this.selectedChannelId,
    this.selectedProviderId,
    this.status,
    this.tenantId,
    this.traceId,
    this.userId,
    this.uuid
  });

  factory AiRoutingDecisionLogRecord.fromJson(Map<String, dynamic> json) {
    return AiRoutingDecisionLogRecord(
      apiKeyId: json['api_key_id']?.toString(),
      candidateSnapshot: (() {
        final map = _sdkworkAsMap(json['candidate_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      capability: json['capability']?.toString(),
      createdAt: json['created_at']?.toString(),
      decisionLatencyMs: json['decision_latency_ms'] is int ? json['decision_latency_ms'] : null,
      decisionMode: json['decision_mode']?.toString(),
      decisionReason: (() {
        final map = _sdkworkAsMap(json['decision_reason']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      fallbackChain: (() {
        final map = _sdkworkAsMap(json['fallback_chain']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      legacyApiKeyId: json['legacy_api_key_id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      policyId: json['policy_id']?.toString(),
      profileId: json['profile_id']?.toString(),
      requestId: json['request_id']?.toString(),
      requestedModel: json['requested_model']?.toString(),
      resolvedModel: json['resolved_model']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      ruleId: json['rule_id']?.toString(),
      selectedAccountId: json['selected_account_id']?.toString(),
      selectedChannelId: json['selected_channel_id']?.toString(),
      selectedProviderId: json['selected_provider_id']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'api_key_id': apiKeyId,
      'candidate_snapshot': candidateSnapshot?.map((key, item) => MapEntry(key, item)),
      'capability': capability,
      'created_at': createdAt,
      'decision_latency_ms': decisionLatencyMs,
      'decision_mode': decisionMode,
      'decision_reason': decisionReason?.map((key, item) => MapEntry(key, item)),
      'fallback_chain': fallbackChain?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'legacy_api_key_id': legacyApiKeyId,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'policy_id': policyId,
      'profile_id': profileId,
      'request_id': requestId,
      'requested_model': requestedModel,
      'resolved_model': resolvedModel,
      'retention_until': retentionUntil,
      'rule_id': ruleId,
      'selected_account_id': selectedAccountId,
      'selected_channel_id': selectedChannelId,
      'selected_provider_id': selectedProviderId,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class AiRoutingPolicyRecord {
  final String? capability;
  final String? costCeiling;
  final String? createdAt;
  final String? currency;
  final String? dataScope;
  final String? defaultProfileId;
  final String? deletedAt;
  final String? deletedBy;
  final String? fallbackMode;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? organizationId;
  final String? policyCode;
  final String? policyScope;
  final int? sloLatencyMs;
  final String? sloSuccessRate;
  final String? status;
  final String? subjectId;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  AiRoutingPolicyRecord({
    this.capability,
    this.costCeiling,
    this.createdAt,
    this.currency,
    this.dataScope,
    this.defaultProfileId,
    this.deletedAt,
    this.deletedBy,
    this.fallbackMode,
    this.id,
    this.metadata,
    this.name,
    this.organizationId,
    this.policyCode,
    this.policyScope,
    this.sloLatencyMs,
    this.sloSuccessRate,
    this.status,
    this.subjectId,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory AiRoutingPolicyRecord.fromJson(Map<String, dynamic> json) {
    return AiRoutingPolicyRecord(
      capability: json['capability']?.toString(),
      costCeiling: json['cost_ceiling']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultProfileId: json['default_profile_id']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      fallbackMode: json['fallback_mode']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      name: json['name']?.toString(),
      organizationId: json['organization_id']?.toString(),
      policyCode: json['policy_code']?.toString(),
      policyScope: json['policy_scope']?.toString(),
      sloLatencyMs: json['slo_latency_ms'] is int ? json['slo_latency_ms'] : null,
      sloSuccessRate: json['slo_success_rate']?.toString(),
      status: json['status']?.toString(),
      subjectId: json['subject_id']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'capability': capability,
      'cost_ceiling': costCeiling,
      'created_at': createdAt,
      'currency': currency,
      'data_scope': dataScope,
      'default_profile_id': defaultProfileId,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'fallback_mode': fallbackMode,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'organization_id': organizationId,
      'policy_code': policyCode,
      'policy_scope': policyScope,
      'slo_latency_ms': sloLatencyMs,
      'slo_success_rate': sloSuccessRate,
      'status': status,
      'subject_id': subjectId,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiRoutingProfileRecord {
  final String? configHash;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? policyId;
  final String? profileName;
  final String? profileVersion;
  final String? publishedAt;
  final String? publishedBy;
  final String? releaseStatus;
  final String? rollbackFromProfileId;
  final String? status;
  final String? tenantId;
  final String? trafficPercent;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  AiRoutingProfileRecord({
    this.configHash,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.id,
    this.metadata,
    this.organizationId,
    this.policyId,
    this.profileName,
    this.profileVersion,
    this.publishedAt,
    this.publishedBy,
    this.releaseStatus,
    this.rollbackFromProfileId,
    this.status,
    this.tenantId,
    this.trafficPercent,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory AiRoutingProfileRecord.fromJson(Map<String, dynamic> json) {
    return AiRoutingProfileRecord(
      configHash: json['config_hash']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      policyId: json['policy_id']?.toString(),
      profileName: json['profile_name']?.toString(),
      profileVersion: json['profile_version']?.toString(),
      publishedAt: json['published_at']?.toString(),
      publishedBy: json['published_by']?.toString(),
      releaseStatus: json['release_status']?.toString(),
      rollbackFromProfileId: json['rollback_from_profile_id']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      trafficPercent: json['traffic_percent']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config_hash': configHash,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'policy_id': policyId,
      'profile_name': profileName,
      'profile_version': profileVersion,
      'published_at': publishedAt,
      'published_by': publishedBy,
      'release_status': releaseStatus,
      'rollback_from_profile_id': rollbackFromProfileId,
      'status': status,
      'tenant_id': tenantId,
      'traffic_percent': trafficPercent,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiRoutingRuleRecord {
  final Map<String, dynamic>? candidateChannels;
  final Map<String, dynamic>? constraints;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final Map<String, dynamic>? fallbackChain;
  final String? id;
  final Map<String, dynamic>? matchExpression;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final int? priority;
  final String? profileId;
  final String? rateLimitPolicyId;
  final String? ruleCode;
  final String? status;
  final String? targetModel;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  AiRoutingRuleRecord({
    this.candidateChannels,
    this.constraints,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.fallbackChain,
    this.id,
    this.matchExpression,
    this.metadata,
    this.organizationId,
    this.priority,
    this.profileId,
    this.rateLimitPolicyId,
    this.ruleCode,
    this.status,
    this.targetModel,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory AiRoutingRuleRecord.fromJson(Map<String, dynamic> json) {
    return AiRoutingRuleRecord(
      candidateChannels: (() {
        final map = _sdkworkAsMap(json['candidate_channels']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      constraints: (() {
        final map = _sdkworkAsMap(json['constraints']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      fallbackChain: (() {
        final map = _sdkworkAsMap(json['fallback_chain']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      matchExpression: (() {
        final map = _sdkworkAsMap(json['match_expression']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      priority: json['priority'] is int ? json['priority'] : null,
      profileId: json['profile_id']?.toString(),
      rateLimitPolicyId: json['rate_limit_policy_id']?.toString(),
      ruleCode: json['rule_code']?.toString(),
      status: json['status']?.toString(),
      targetModel: json['target_model']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'candidate_channels': candidateChannels?.map((key, item) => MapEntry(key, item)),
      'constraints': constraints?.map((key, item) => MapEntry(key, item)),
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'fallback_chain': fallbackChain?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'match_expression': matchExpression?.map((key, item) => MapEntry(key, item)),
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'priority': priority,
      'profile_id': profileId,
      'rate_limit_policy_id': rateLimitPolicyId,
      'rule_code': ruleCode,
      'status': status,
      'target_model': targetModel,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class AiUsageFactRecord {
  final String? apiKeyGroupId;
  final String? apiKeyGroupSnapshot;
  final String? apiKeyId;
  final String? apiKeyNameSnapshot;
  final String? audioSeconds;
  final String? bandwidthBytes;
  final String? baseInputUnitPrice;
  final String? baseOutputUnitPrice;
  final String? billableQuantity;
  final String? billableUnit;
  final String? billingMeterCode;
  final String? billingMeterId;
  final String? billingMode;
  final String? billingTier;
  final String? billingType;
  final String? cacheReadUnitPrice;
  final String? cachedTokens;
  final String? catalogKey;
  final String? channelId;
  final String? characterCount;
  final String? completionTokens;
  final String? costAmount;
  final String? createdAt;
  final String? currency;
  final String? customerChargeAmount;
  final String? decisionLogId;
  final String? id;
  final String? imageCount;
  final String? itemCount;
  final String? legacyApiKeyId;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? modality;
  final String? model;
  final String? occurredAt;
  final String? officialReferenceAmount;
  final String? organizationId;
  final String? ownerId;
  final String? ownerNameSnapshot;
  final String? ownerType;
  final String? payloadHash;
  final String? pricingId;
  final String? pricingPlanCode;
  final String? pricingPlanId;
  final String? pricingRuleId;
  final Map<String, dynamic>? pricingSnapshot;
  final String? pricingTierId;
  final String? promptTokens;
  final String? providerAccountId;
  final String? providerId;
  final String? rateMultiplier;
  final String? reasoningEffort;
  final String? referenceMultiplier;
  final String? requestCount;
  final String? requestId;
  final String? resultCount;
  final String? retentionUntil;
  final String? settlementId;
  final String? settlementStatus;
  final String? status;
  final String? storageByteHours;
  final String? tenantId;
  final String? totalTokens;
  final String? traceId;
  final String? unitPriceSnapshot;
  final String? upstreamCostAmount;
  final String? usageType;
  final String? userId;
  final String? uuid;
  final String? videoSeconds;

  AiUsageFactRecord({
    this.apiKeyGroupId,
    this.apiKeyGroupSnapshot,
    this.apiKeyId,
    this.apiKeyNameSnapshot,
    this.audioSeconds,
    this.bandwidthBytes,
    this.baseInputUnitPrice,
    this.baseOutputUnitPrice,
    this.billableQuantity,
    this.billableUnit,
    this.billingMeterCode,
    this.billingMeterId,
    this.billingMode,
    this.billingTier,
    this.billingType,
    this.cacheReadUnitPrice,
    this.cachedTokens,
    this.catalogKey,
    this.channelId,
    this.characterCount,
    this.completionTokens,
    this.costAmount,
    this.createdAt,
    this.currency,
    this.customerChargeAmount,
    this.decisionLogId,
    this.id,
    this.imageCount,
    this.itemCount,
    this.legacyApiKeyId,
    this.legalHold,
    this.metadata,
    this.modality,
    this.model,
    this.occurredAt,
    this.officialReferenceAmount,
    this.organizationId,
    this.ownerId,
    this.ownerNameSnapshot,
    this.ownerType,
    this.payloadHash,
    this.pricingId,
    this.pricingPlanCode,
    this.pricingPlanId,
    this.pricingRuleId,
    this.pricingSnapshot,
    this.pricingTierId,
    this.promptTokens,
    this.providerAccountId,
    this.providerId,
    this.rateMultiplier,
    this.reasoningEffort,
    this.referenceMultiplier,
    this.requestCount,
    this.requestId,
    this.resultCount,
    this.retentionUntil,
    this.settlementId,
    this.settlementStatus,
    this.status,
    this.storageByteHours,
    this.tenantId,
    this.totalTokens,
    this.traceId,
    this.unitPriceSnapshot,
    this.upstreamCostAmount,
    this.usageType,
    this.userId,
    this.uuid,
    this.videoSeconds
  });

  factory AiUsageFactRecord.fromJson(Map<String, dynamic> json) {
    return AiUsageFactRecord(
      apiKeyGroupId: json['api_key_group_id']?.toString(),
      apiKeyGroupSnapshot: json['api_key_group_snapshot']?.toString(),
      apiKeyId: json['api_key_id']?.toString(),
      apiKeyNameSnapshot: json['api_key_name_snapshot']?.toString(),
      audioSeconds: json['audio_seconds']?.toString(),
      bandwidthBytes: json['bandwidth_bytes']?.toString(),
      baseInputUnitPrice: json['base_input_unit_price']?.toString(),
      baseOutputUnitPrice: json['base_output_unit_price']?.toString(),
      billableQuantity: json['billable_quantity']?.toString(),
      billableUnit: json['billable_unit']?.toString(),
      billingMeterCode: json['billing_meter_code']?.toString(),
      billingMeterId: json['billing_meter_id']?.toString(),
      billingMode: json['billing_mode']?.toString(),
      billingTier: json['billing_tier']?.toString(),
      billingType: json['billing_type']?.toString(),
      cacheReadUnitPrice: json['cache_read_unit_price']?.toString(),
      cachedTokens: json['cached_tokens']?.toString(),
      catalogKey: json['catalog_key']?.toString(),
      channelId: json['channel_id']?.toString(),
      characterCount: json['character_count']?.toString(),
      completionTokens: json['completion_tokens']?.toString(),
      costAmount: json['cost_amount']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      customerChargeAmount: json['customer_charge_amount']?.toString(),
      decisionLogId: json['decision_log_id']?.toString(),
      id: json['id']?.toString(),
      imageCount: json['image_count']?.toString(),
      itemCount: json['item_count']?.toString(),
      legacyApiKeyId: json['legacy_api_key_id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modality: json['modality']?.toString(),
      model: json['model']?.toString(),
      occurredAt: json['occurred_at']?.toString(),
      officialReferenceAmount: json['official_reference_amount']?.toString(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerNameSnapshot: json['owner_name_snapshot']?.toString(),
      ownerType: json['owner_type']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      pricingId: json['pricing_id']?.toString(),
      pricingPlanCode: json['pricing_plan_code']?.toString(),
      pricingPlanId: json['pricing_plan_id']?.toString(),
      pricingRuleId: json['pricing_rule_id']?.toString(),
      pricingSnapshot: (() {
        final map = _sdkworkAsMap(json['pricing_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      pricingTierId: json['pricing_tier_id']?.toString(),
      promptTokens: json['prompt_tokens']?.toString(),
      providerAccountId: json['provider_account_id']?.toString(),
      providerId: json['provider_id']?.toString(),
      rateMultiplier: json['rate_multiplier']?.toString(),
      reasoningEffort: json['reasoning_effort']?.toString(),
      referenceMultiplier: json['reference_multiplier']?.toString(),
      requestCount: json['request_count']?.toString(),
      requestId: json['request_id']?.toString(),
      resultCount: json['result_count']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      settlementId: json['settlement_id']?.toString(),
      settlementStatus: json['settlement_status']?.toString(),
      status: json['status']?.toString(),
      storageByteHours: json['storage_byte_hours']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      totalTokens: json['total_tokens']?.toString(),
      traceId: json['trace_id']?.toString(),
      unitPriceSnapshot: json['unit_price_snapshot']?.toString(),
      upstreamCostAmount: json['upstream_cost_amount']?.toString(),
      usageType: json['usage_type']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      videoSeconds: json['video_seconds']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'api_key_group_id': apiKeyGroupId,
      'api_key_group_snapshot': apiKeyGroupSnapshot,
      'api_key_id': apiKeyId,
      'api_key_name_snapshot': apiKeyNameSnapshot,
      'audio_seconds': audioSeconds,
      'bandwidth_bytes': bandwidthBytes,
      'base_input_unit_price': baseInputUnitPrice,
      'base_output_unit_price': baseOutputUnitPrice,
      'billable_quantity': billableQuantity,
      'billable_unit': billableUnit,
      'billing_meter_code': billingMeterCode,
      'billing_meter_id': billingMeterId,
      'billing_mode': billingMode,
      'billing_tier': billingTier,
      'billing_type': billingType,
      'cache_read_unit_price': cacheReadUnitPrice,
      'cached_tokens': cachedTokens,
      'catalog_key': catalogKey,
      'channel_id': channelId,
      'character_count': characterCount,
      'completion_tokens': completionTokens,
      'cost_amount': costAmount,
      'created_at': createdAt,
      'currency': currency,
      'customer_charge_amount': customerChargeAmount,
      'decision_log_id': decisionLogId,
      'id': id,
      'image_count': imageCount,
      'item_count': itemCount,
      'legacy_api_key_id': legacyApiKeyId,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modality': modality,
      'model': model,
      'occurred_at': occurredAt,
      'official_reference_amount': officialReferenceAmount,
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_name_snapshot': ownerNameSnapshot,
      'owner_type': ownerType,
      'payload_hash': payloadHash,
      'pricing_id': pricingId,
      'pricing_plan_code': pricingPlanCode,
      'pricing_plan_id': pricingPlanId,
      'pricing_rule_id': pricingRuleId,
      'pricing_snapshot': pricingSnapshot?.map((key, item) => MapEntry(key, item)),
      'pricing_tier_id': pricingTierId,
      'prompt_tokens': promptTokens,
      'provider_account_id': providerAccountId,
      'provider_id': providerId,
      'rate_multiplier': rateMultiplier,
      'reasoning_effort': reasoningEffort,
      'reference_multiplier': referenceMultiplier,
      'request_count': requestCount,
      'request_id': requestId,
      'result_count': resultCount,
      'retention_until': retentionUntil,
      'settlement_id': settlementId,
      'settlement_status': settlementStatus,
      'status': status,
      'storage_byte_hours': storageByteHours,
      'tenant_id': tenantId,
      'total_tokens': totalTokens,
      'trace_id': traceId,
      'unit_price_snapshot': unitPriceSnapshot,
      'upstream_cost_amount': upstreamCostAmount,
      'usage_type': usageType,
      'user_id': userId,
      'uuid': uuid,
      'video_seconds': videoSeconds,
    };
  }
}

class ApiKeysCreateResult {
  final String? code;
  final CreateApiKeyResponse? data;
  final String? message;
  final String? msg;

  ApiKeysCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ApiKeysCreateResult.fromJson(Map<String, dynamic> json) {
    return ApiKeysCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CreateApiKeyResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class ApiKeysListResult {
  final String? code;
  final AppApiKeyListResponse? data;
  final String? message;
  final String? msg;

  ApiKeysListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ApiKeysListResult.fromJson(Map<String, dynamic> json) {
    return ApiKeysListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppApiKeyListResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AppApiKeyGroup {
  final String? code;
  final String? id;
  final String? name;
  final String? rate;

  AppApiKeyGroup({
    this.code,
    this.id,
    this.name,
    this.rate
  });

  factory AppApiKeyGroup.fromJson(Map<String, dynamic> json) {
    return AppApiKeyGroup(
      code: json['code']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      rate: json['rate']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'id': id,
      'name': name,
      'rate': rate,
    };
  }
}

class AppApiKeyItem {
  final String? created;
  final String? expires;
  final String? group;
  final String? id;
  final String? ipLimit;
  final String? maskedKey;
  final List<String>? modalities;
  final String? name;
  final String? quota;
  final String? rate;
  final String? status;
  final String? usedQuota;

  AppApiKeyItem({
    this.created,
    this.expires,
    this.group,
    this.id,
    this.ipLimit,
    this.maskedKey,
    this.modalities,
    this.name,
    this.quota,
    this.rate,
    this.status,
    this.usedQuota
  });

  factory AppApiKeyItem.fromJson(Map<String, dynamic> json) {
    return AppApiKeyItem(
      created: json['created']?.toString(),
      expires: json['expires']?.toString(),
      group: json['group']?.toString(),
      id: json['id']?.toString(),
      ipLimit: json['ipLimit']?.toString(),
      maskedKey: json['maskedKey']?.toString(),
      modalities: (() {
        final list = _sdkworkAsList(json['modalities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: json['name']?.toString(),
      quota: json['quota']?.toString(),
      rate: json['rate']?.toString(),
      status: json['status']?.toString(),
      usedQuota: json['usedQuota']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created': created,
      'expires': expires,
      'group': group,
      'id': id,
      'ipLimit': ipLimit,
      'maskedKey': maskedKey,
      'modalities': modalities?.map((item) => item).toList(),
      'name': name,
      'quota': quota,
      'rate': rate,
      'status': status,
      'usedQuota': usedQuota,
    };
  }
}

class AppApiKeyListResponse {
  final List<AppApiKeyGroup>? groups;
  final List<AppApiKeyItem>? items;

  AppApiKeyListResponse({
    this.groups,
    this.items
  });

  factory AppApiKeyListResponse.fromJson(Map<String, dynamic> json) {
    return AppApiKeyListResponse(
      groups: (() {
        final list = _sdkworkAsList(json['groups']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppApiKeyGroup.fromJson(map);
      })())
            .whereType<AppApiKeyGroup>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppApiKeyItem.fromJson(map);
      })())
            .whereType<AppApiKeyItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'groups': groups?.map((item) => item.toJson()).toList(),
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class AppCatalogItem {
  final String? category;
  final String? description;
  final String? developer;
  final String? downloads;
  final List<String>? features;
  final String? id;
  final String? image;
  final String? name;
  final double? rating;
  final List<AppReleaseItem>? releases;
  final List<String>? screenshots;

  AppCatalogItem({
    this.category,
    this.description,
    this.developer,
    this.downloads,
    this.features,
    this.id,
    this.image,
    this.name,
    this.rating,
    this.releases,
    this.screenshots
  });

  factory AppCatalogItem.fromJson(Map<String, dynamic> json) {
    return AppCatalogItem(
      category: json['category']?.toString(),
      description: json['description']?.toString(),
      developer: json['developer']?.toString(),
      downloads: json['downloads']?.toString(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
      image: json['image']?.toString(),
      name: json['name']?.toString(),
      rating: json['rating'] is num ? json['rating'].toDouble() : null,
      releases: (() {
        final list = _sdkworkAsList(json['releases']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppReleaseItem.fromJson(map);
      })())
            .whereType<AppReleaseItem>()
            .toList();
      })(),
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features?.map((item) => item).toList(),
      'id': id,
      'image': image,
      'name': name,
      'rating': rating,
      'releases': releases?.map((item) => item.toJson()).toList(),
      'screenshots': screenshots?.map((item) => item).toList(),
    };
  }
}

class AppCatalogResponse {
  final List<AppCatalogItem>? items;

  AppCatalogResponse({
    this.items
  });

  factory AppCatalogResponse.fromJson(Map<String, dynamic> json) {
    return AppCatalogResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppCatalogItem.fromJson(map);
      })())
            .whereType<AppCatalogItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class AppCategoriesResponse {
  final List<String>? items;

  AppCategoriesResponse({
    this.items
  });

  factory AppCategoriesResponse.fromJson(Map<String, dynamic> json) {
    return AppCategoriesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item).toList(),
    };
  }
}

class AppDetailResponse {
  final String? category;
  final String? description;
  final String? developer;
  final String? downloads;
  final List<String>? features;
  final String? id;
  final String? image;
  final String? name;
  final double? rating;
  final List<AppReleaseItem>? releases;
  final List<String>? screenshots;

  AppDetailResponse({
    this.category,
    this.description,
    this.developer,
    this.downloads,
    this.features,
    this.id,
    this.image,
    this.name,
    this.rating,
    this.releases,
    this.screenshots
  });

  factory AppDetailResponse.fromJson(Map<String, dynamic> json) {
    return AppDetailResponse(
      category: json['category']?.toString(),
      description: json['description']?.toString(),
      developer: json['developer']?.toString(),
      downloads: json['downloads']?.toString(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
      image: json['image']?.toString(),
      name: json['name']?.toString(),
      rating: json['rating'] is num ? json['rating'].toDouble() : null,
      releases: (() {
        final list = _sdkworkAsList(json['releases']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppReleaseItem.fromJson(map);
      })())
            .whereType<AppReleaseItem>()
            .toList();
      })(),
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features?.map((item) => item).toList(),
      'id': id,
      'image': image,
      'name': name,
      'rating': rating,
      'releases': releases?.map((item) => item.toJson()).toList(),
      'screenshots': screenshots?.map((item) => item).toList(),
    };
  }
}

class AppInstalledSkillItem {
  final Map<String, dynamic>? config;
  final bool? enabled;
  final String? id;
  final String? installedAt;
  final String? lastEnabledAt;
  final SkillCatalogItem? skill;
  final String? skillId;

  AppInstalledSkillItem({
    this.config,
    this.enabled,
    this.id,
    this.installedAt,
    this.lastEnabledAt,
    this.skill,
    this.skillId
  });

  factory AppInstalledSkillItem.fromJson(Map<String, dynamic> json) {
    return AppInstalledSkillItem(
      config: (() {
        final map = _sdkworkAsMap(json['config']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      enabled: json['enabled'] is bool ? json['enabled'] : null,
      id: json['id']?.toString(),
      installedAt: json['installedAt']?.toString(),
      lastEnabledAt: json['lastEnabledAt']?.toString(),
      skill: (() {
        final map = _sdkworkAsMap(json['skill']);
        return map == null ? null : SkillCatalogItem.fromJson(map);
      })(),
      skillId: json['skillId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config': config?.map((key, item) => MapEntry(key, item)),
      'enabled': enabled,
      'id': id,
      'installedAt': installedAt,
      'lastEnabledAt': lastEnabledAt,
      'skill': skill?.toJson(),
      'skillId': skillId,
    };
  }
}

class AppInstalledSkillResponse {
  final AppInstalledSkillItem? item;

  AppInstalledSkillResponse({
    this.item
  });

  factory AppInstalledSkillResponse.fromJson(Map<String, dynamic> json) {
    return AppInstalledSkillResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        return map == null ? null : AppInstalledSkillItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item?.toJson(),
    };
  }
}

class AppInstalledSkillsResponse {
  final List<AppInstalledSkillItem>? items;

  AppInstalledSkillsResponse({
    this.items
  });

  factory AppInstalledSkillsResponse.fromJson(Map<String, dynamic> json) {
    return AppInstalledSkillsResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppInstalledSkillItem.fromJson(map);
      })())
            .whereType<AppInstalledSkillItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class AppModelCatalogItem {
  final String? apiFormat;
  final List<String>? capabilities;
  final String? capabilityIntro;
  final String? catalogKey;
  final List<String>? categories;
  final int? contextTokens;
  final String? description;
  final String? displayName;
  final List<String>? groups;
  final List<String>? inputModalities;
  final List<String>? limitations;
  final int? maxOutputTokens;
  final List<String>? modalities;
  final String? model;
  final String? officialReferenceCurrency;
  final List<AppModelCatalogReferencePrice>? officialReferencePrices;
  final String? officialReferenceUnitPrice;
  final List<String>? outputModalities;
  final AppModelCatalogPriceAvailability? priceAvailability;
  final List<String>? providerCodes;
  final String? regionCode;
  final int? releaseStage;
  final String? replacementModel;
  final int? routingState;
  final int? shelfState;
  final List<String>? supportedLanguages;
  final bool? supportsJsonSchema;
  final bool? supportsStreaming;
  final bool? supportsTools;
  final String? trainingDataCutoff;
  final List<String>? useCases;
  final String? vendor;
  final String? vendorCode;

  AppModelCatalogItem({
    this.apiFormat,
    this.capabilities,
    this.capabilityIntro,
    this.catalogKey,
    this.categories,
    this.contextTokens,
    this.description,
    this.displayName,
    this.groups,
    this.inputModalities,
    this.limitations,
    this.maxOutputTokens,
    this.modalities,
    this.model,
    this.officialReferenceCurrency,
    this.officialReferencePrices,
    this.officialReferenceUnitPrice,
    this.outputModalities,
    this.priceAvailability,
    this.providerCodes,
    this.regionCode,
    this.releaseStage,
    this.replacementModel,
    this.routingState,
    this.shelfState,
    this.supportedLanguages,
    this.supportsJsonSchema,
    this.supportsStreaming,
    this.supportsTools,
    this.trainingDataCutoff,
    this.useCases,
    this.vendor,
    this.vendorCode
  });

  factory AppModelCatalogItem.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogItem(
      apiFormat: json['apiFormat']?.toString(),
      capabilities: (() {
        final list = _sdkworkAsList(json['capabilities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      capabilityIntro: json['capabilityIntro']?.toString(),
      catalogKey: json['catalogKey']?.toString(),
      categories: (() {
        final list = _sdkworkAsList(json['categories']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      contextTokens: json['contextTokens'] is int ? json['contextTokens'] : null,
      description: json['description']?.toString(),
      displayName: json['displayName']?.toString(),
      groups: (() {
        final list = _sdkworkAsList(json['groups']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      inputModalities: (() {
        final list = _sdkworkAsList(json['inputModalities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      limitations: (() {
        final list = _sdkworkAsList(json['limitations']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      maxOutputTokens: json['maxOutputTokens'] is int ? json['maxOutputTokens'] : null,
      modalities: (() {
        final list = _sdkworkAsList(json['modalities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      model: json['model']?.toString(),
      officialReferenceCurrency: json['officialReferenceCurrency']?.toString(),
      officialReferencePrices: (() {
        final list = _sdkworkAsList(json['officialReferencePrices']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppModelCatalogReferencePrice.fromJson(map);
      })())
            .whereType<AppModelCatalogReferencePrice>()
            .toList();
      })(),
      officialReferenceUnitPrice: json['officialReferenceUnitPrice']?.toString(),
      outputModalities: (() {
        final list = _sdkworkAsList(json['outputModalities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      priceAvailability: (() {
        final map = _sdkworkAsMap(json['priceAvailability']);
        return map == null ? null : AppModelCatalogPriceAvailability.fromJson(map);
      })(),
      providerCodes: (() {
        final list = _sdkworkAsList(json['providerCodes']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      regionCode: json['regionCode']?.toString(),
      releaseStage: json['releaseStage'] is int ? json['releaseStage'] : null,
      replacementModel: json['replacementModel']?.toString(),
      routingState: json['routingState'] is int ? json['routingState'] : null,
      shelfState: json['shelfState'] is int ? json['shelfState'] : null,
      supportedLanguages: (() {
        final list = _sdkworkAsList(json['supportedLanguages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      supportsJsonSchema: json['supportsJsonSchema'] is bool ? json['supportsJsonSchema'] : null,
      supportsStreaming: json['supportsStreaming'] is bool ? json['supportsStreaming'] : null,
      supportsTools: json['supportsTools'] is bool ? json['supportsTools'] : null,
      trainingDataCutoff: json['trainingDataCutoff']?.toString(),
      useCases: (() {
        final list = _sdkworkAsList(json['useCases']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      vendor: json['vendor']?.toString(),
      vendorCode: json['vendorCode']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'apiFormat': apiFormat,
      'capabilities': capabilities?.map((item) => item).toList(),
      'capabilityIntro': capabilityIntro,
      'catalogKey': catalogKey,
      'categories': categories?.map((item) => item).toList(),
      'contextTokens': contextTokens,
      'description': description,
      'displayName': displayName,
      'groups': groups?.map((item) => item).toList(),
      'inputModalities': inputModalities?.map((item) => item).toList(),
      'limitations': limitations?.map((item) => item).toList(),
      'maxOutputTokens': maxOutputTokens,
      'modalities': modalities?.map((item) => item).toList(),
      'model': model,
      'officialReferenceCurrency': officialReferenceCurrency,
      'officialReferencePrices': officialReferencePrices?.map((item) => item.toJson()).toList(),
      'officialReferenceUnitPrice': officialReferenceUnitPrice,
      'outputModalities': outputModalities?.map((item) => item).toList(),
      'priceAvailability': priceAvailability?.toJson(),
      'providerCodes': providerCodes?.map((item) => item).toList(),
      'regionCode': regionCode,
      'releaseStage': releaseStage,
      'replacementModel': replacementModel,
      'routingState': routingState,
      'shelfState': shelfState,
      'supportedLanguages': supportedLanguages?.map((item) => item).toList(),
      'supportsJsonSchema': supportsJsonSchema,
      'supportsStreaming': supportsStreaming,
      'supportsTools': supportsTools,
      'trainingDataCutoff': trainingDataCutoff,
      'useCases': useCases?.map((item) => item).toList(),
      'vendor': vendor,
      'vendorCode': vendorCode,
    };
  }
}

class AppModelCatalogPriceAvailability {
  final String? reason;
  final String? status;

  AppModelCatalogPriceAvailability({
    this.reason,
    this.status
  });

  factory AppModelCatalogPriceAvailability.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogPriceAvailability(
      reason: json['reason']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'reason': reason,
      'status': status,
    };
  }
}

class AppModelCatalogReferencePrice {
  final String? billingMeter;
  final String? currency;
  final String? unitPrice;

  AppModelCatalogReferencePrice({
    this.billingMeter,
    this.currency,
    this.unitPrice
  });

  factory AppModelCatalogReferencePrice.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogReferencePrice(
      billingMeter: json['billingMeter']?.toString(),
      currency: json['currency']?.toString(),
      unitPrice: json['unitPrice']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'billingMeter': billingMeter,
      'currency': currency,
      'unitPrice': unitPrice,
    };
  }
}

class AppModelCatalogResponse {
  final List<AppModelCatalogItem>? items;

  AppModelCatalogResponse({
    this.items
  });

  factory AppModelCatalogResponse.fromJson(Map<String, dynamic> json) {
    return AppModelCatalogResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : AppModelCatalogItem.fromJson(map);
      })())
            .whereType<AppModelCatalogItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class AppReleaseItem {
  final String? downloadUrl;
  final String? id;
  final String? os;
  final String? platformType;
  final String? releaseDate;
  final String? size;
  final String? version;
  final String? whatsNew;

  AppReleaseItem({
    this.downloadUrl,
    this.id,
    this.os,
    this.platformType,
    this.releaseDate,
    this.size,
    this.version,
    this.whatsNew
  });

  factory AppReleaseItem.fromJson(Map<String, dynamic> json) {
    return AppReleaseItem(
      downloadUrl: json['downloadUrl']?.toString(),
      id: json['id']?.toString(),
      os: json['os']?.toString(),
      platformType: json['platformType']?.toString(),
      releaseDate: json['releaseDate']?.toString(),
      size: json['size']?.toString(),
      version: json['version']?.toString(),
      whatsNew: json['whatsNew']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'downloadUrl': downloadUrl,
      'id': id,
      'os': os,
      'platformType': platformType,
      'releaseDate': releaseDate,
      'size': size,
      'version': version,
      'whatsNew': whatsNew,
    };
  }
}

class AppSkillConfigRequest {
  final Map<String, dynamic>? config;

  AppSkillConfigRequest({
    this.config
  });

  factory AppSkillConfigRequest.fromJson(Map<String, dynamic> json) {
    return AppSkillConfigRequest(
      config: (() {
        final map = _sdkworkAsMap(json['config']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config': config?.map((key, item) => MapEntry(key, item)),
    };
  }
}

class ApplicationsCreateResult {
  final String? code;
  final CourseApplicationCreateResponse? data;
  final String? message;
  final String? msg;

  ApplicationsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ApplicationsCreateResult.fromJson(Map<String, dynamic> json) {
    return ApplicationsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseApplicationCreateResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class ApplicationsVideosCreateResult {
  final String? code;
  final CourseApplicationVideoUploadResponse? data;
  final String? message;
  final String? msg;

  ApplicationsVideosCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ApplicationsVideosCreateResult.fromJson(Map<String, dynamic> json) {
    return ApplicationsVideosCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseApplicationVideoUploadResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AppsStoreCategoriesListResult {
  final String? code;
  final AppCategoriesResponse? data;
  final String? message;
  final String? msg;

  AppsStoreCategoriesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AppsStoreCategoriesListResult.fromJson(Map<String, dynamic> json) {
    return AppsStoreCategoriesListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppCategoriesResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AppsStoreListResult {
  final String? code;
  final AppCatalogResponse? data;
  final String? message;
  final String? msg;

  AppsStoreListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AppsStoreListResult.fromJson(Map<String, dynamic> json) {
    return AppsStoreListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppCatalogResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class AppsStoreRetrieveResult {
  final String? code;
  final AppDetailResponse? data;
  final String? message;
  final String? msg;

  AppsStoreRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory AppsStoreRetrieveResult.fromJson(Map<String, dynamic> json) {
    return AppsStoreRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppDetailResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class BillingRechargeHistoryItem {
  final String? amount;
  final String? date;
  final int? id;
  final String? method;
  final String? orderNo;
  final String? status;

  BillingRechargeHistoryItem({
    this.amount,
    this.date,
    this.id,
    this.method,
    this.orderNo,
    this.status
  });

  factory BillingRechargeHistoryItem.fromJson(Map<String, dynamic> json) {
    return BillingRechargeHistoryItem(
      amount: json['amount']?.toString(),
      date: json['date']?.toString(),
      id: json['id'] is int ? json['id'] : null,
      method: json['method']?.toString(),
      orderNo: json['orderNo']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'date': date,
      'id': id,
      'method': method,
      'orderNo': orderNo,
      'status': status,
    };
  }
}

class BillingRedeemHistoryItem {
  final String? amount;
  final String? code;
  final String? date;
  final int? id;
  final String? status;

  BillingRedeemHistoryItem({
    this.amount,
    this.code,
    this.date,
    this.id,
    this.status
  });

  factory BillingRedeemHistoryItem.fromJson(Map<String, dynamic> json) {
    return BillingRedeemHistoryItem(
      amount: json['amount']?.toString(),
      code: json['code']?.toString(),
      date: json['date']?.toString(),
      id: json['id'] is int ? json['id'] : null,
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'code': code,
      'date': date,
      'id': id,
      'status': status,
    };
  }
}

class CheckoutStatusResponse {
  final String? amount;
  final String? createdAt;
  final String? expiresAt;
  final String? nextAction;
  final String? orderNo;
  final String? orderStatus;
  final String? outTradeNo;
  final String? paidAt;
  final String? paymentMethod;
  final String? paymentStatus;
  final int? points;
  final String? qrCodePayload;
  final String? rechargeStatus;
  final String? status;

  CheckoutStatusResponse({
    this.amount,
    this.createdAt,
    this.expiresAt,
    this.nextAction,
    this.orderNo,
    this.orderStatus,
    this.outTradeNo,
    this.paidAt,
    this.paymentMethod,
    this.paymentStatus,
    this.points,
    this.qrCodePayload,
    this.rechargeStatus,
    this.status
  });

  factory CheckoutStatusResponse.fromJson(Map<String, dynamic> json) {
    return CheckoutStatusResponse(
      amount: json['amount']?.toString(),
      createdAt: json['createdAt']?.toString(),
      expiresAt: json['expiresAt']?.toString(),
      nextAction: json['nextAction']?.toString(),
      orderNo: json['orderNo']?.toString(),
      orderStatus: json['orderStatus']?.toString(),
      outTradeNo: json['outTradeNo']?.toString(),
      paidAt: json['paidAt']?.toString(),
      paymentMethod: json['paymentMethod']?.toString(),
      paymentStatus: json['paymentStatus']?.toString(),
      points: json['points'] is int ? json['points'] : null,
      qrCodePayload: json['qrCodePayload']?.toString(),
      rechargeStatus: json['rechargeStatus']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'createdAt': createdAt,
      'expiresAt': expiresAt,
      'nextAction': nextAction,
      'orderNo': orderNo,
      'orderStatus': orderStatus,
      'outTradeNo': outTradeNo,
      'paidAt': paidAt,
      'paymentMethod': paymentMethod,
      'paymentStatus': paymentStatus,
      'points': points,
      'qrCodePayload': qrCodePayload,
      'rechargeStatus': rechargeStatus,
      'status': status,
    };
  }
}

class CommentsCreateResult {
  final String? code;
  final ForumCommentItem? data;
  final String? message;
  final String? msg;

  CommentsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsDeleteResult {
  final String? code;
  final NoData? data;
  final String? message;
  final String? msg;

  CommentsDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsDeleteResult.fromJson(Map<String, dynamic> json) {
    return CommentsDeleteResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NoData.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsLikesCreateResult {
  final String? code;
  final ForumCommentItem? data;
  final String? message;
  final String? msg;

  CommentsLikesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsLikesCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsLikesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsLikesCurrentDeleteResult {
  final String? code;
  final ForumCommentItem? data;
  final String? message;
  final String? msg;

  CommentsLikesCurrentDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsLikesCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return CommentsLikesCurrentDeleteResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsListResult {
  final String? code;
  final ForumCommentPage? data;
  final String? message;
  final String? msg;

  CommentsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsListResult.fromJson(Map<String, dynamic> json) {
    return CommentsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentPage.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsPinsCreateResult {
  final String? code;
  final ForumCommentItem? data;
  final String? message;
  final String? msg;

  CommentsPinsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsPinsCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsPinsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsPinsCurrentDeleteResult {
  final String? code;
  final ForumCommentItem? data;
  final String? message;
  final String? msg;

  CommentsPinsCurrentDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsPinsCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return CommentsPinsCurrentDeleteResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsRepliesListResult {
  final String? code;
  final ForumCommentPage? data;
  final String? message;
  final String? msg;

  CommentsRepliesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsRepliesListResult.fromJson(Map<String, dynamic> json) {
    return CommentsRepliesListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentPage.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsReplyCreateResult {
  final String? code;
  final ForumCommentItem? data;
  final String? message;
  final String? msg;

  CommentsReplyCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsReplyCreateResult.fromJson(Map<String, dynamic> json) {
    return CommentsReplyCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsRetrieveResult {
  final String? code;
  final ForumCommentDetail? data;
  final String? message;
  final String? msg;

  CommentsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return CommentsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentDetail.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommentsStatisticsListResult {
  final String? code;
  final ForumCommentStatistics? data;
  final String? message;
  final String? msg;

  CommentsStatisticsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CommentsStatisticsListResult.fromJson(Map<String, dynamic> json) {
    return CommentsStatisticsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentStatistics.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CommerceBillingExportRecord {
  final String? approvedBy;
  final String? auditLogId;
  final String? createdAt;
  final String? createdBy;
  final String? downloadCount;
  final String? expireAt;
  final String? exportNo;
  final String? exportType;
  final String? fileHash;
  final Map<String, dynamic>? fileManifest;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? periodEnd;
  final String? periodStart;
  final String? requestId;
  final String? retentionUntil;
  final String? statementId;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userId;
  final String? uuid;

  CommerceBillingExportRecord({
    this.approvedBy,
    this.auditLogId,
    this.createdAt,
    this.createdBy,
    this.downloadCount,
    this.expireAt,
    this.exportNo,
    this.exportType,
    this.fileHash,
    this.fileManifest,
    this.id,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.periodEnd,
    this.periodStart,
    this.requestId,
    this.retentionUntil,
    this.statementId,
    this.status,
    this.tenantId,
    this.traceId,
    this.userId,
    this.uuid
  });

  factory CommerceBillingExportRecord.fromJson(Map<String, dynamic> json) {
    return CommerceBillingExportRecord(
      approvedBy: json['approved_by']?.toString(),
      auditLogId: json['audit_log_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      createdBy: json['created_by']?.toString(),
      downloadCount: json['download_count']?.toString(),
      expireAt: json['expire_at']?.toString(),
      exportNo: json['export_no']?.toString(),
      exportType: json['export_type']?.toString(),
      fileHash: json['file_hash']?.toString(),
      fileManifest: (() {
        final map = _sdkworkAsMap(json['file_manifest']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      periodEnd: json['period_end']?.toString(),
      periodStart: json['period_start']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      statementId: json['statement_id']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'approved_by': approvedBy,
      'audit_log_id': auditLogId,
      'created_at': createdAt,
      'created_by': createdBy,
      'download_count': downloadCount,
      'expire_at': expireAt,
      'export_no': exportNo,
      'export_type': exportType,
      'file_hash': fileHash,
      'file_manifest': fileManifest?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'period_end': periodEnd,
      'period_start': periodStart,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'statement_id': statementId,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class CommerceCouponCatalogItem {
  final String? id;
  final String? name;
  final String? status;
  final String? type;
  final String? value;

  CommerceCouponCatalogItem({
    this.id,
    this.name,
    this.status,
    this.type,
    this.value
  });

  factory CommerceCouponCatalogItem.fromJson(Map<String, dynamic> json) {
    return CommerceCouponCatalogItem(
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      status: json['status']?.toString(),
      type: json['type']?.toString(),
      value: json['value']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'status': status,
      'type': type,
      'value': value,
    };
  }
}

class CommerceCouponClaimRequest {
  final String? claimSource;
  final String? couponId;

  CommerceCouponClaimRequest({
    this.claimSource,
    this.couponId
  });

  factory CommerceCouponClaimRequest.fromJson(Map<String, dynamic> json) {
    return CommerceCouponClaimRequest(
      claimSource: json['claimSource']?.toString(),
      couponId: json['couponId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'claimSource': claimSource,
      'couponId': couponId,
    };
  }
}

class CommerceCouponUsageRequest {
  final String? amount;
  final String? businessNo;
  final String? requestNo;
  final String? userCouponId;

  CommerceCouponUsageRequest({
    this.amount,
    this.businessNo,
    this.requestNo,
    this.userCouponId
  });

  factory CommerceCouponUsageRequest.fromJson(Map<String, dynamic> json) {
    return CommerceCouponUsageRequest(
      amount: json['amount']?.toString(),
      businessNo: json['businessNo']?.toString(),
      requestNo: json['requestNo']?.toString(),
      userCouponId: json['userCouponId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'businessNo': businessNo,
      'requestNo': requestNo,
      'userCouponId': userCouponId,
    };
  }
}

class CommerceCouponUsageRollbackRequest {
  final String? reason;
  final String? requestNo;
  final String? usageNo;

  CommerceCouponUsageRollbackRequest({
    this.reason,
    this.requestNo,
    this.usageNo
  });

  factory CommerceCouponUsageRollbackRequest.fromJson(Map<String, dynamic> json) {
    return CommerceCouponUsageRollbackRequest(
      reason: json['reason']?.toString(),
      requestNo: json['requestNo']?.toString(),
      usageNo: json['usageNo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'reason': reason,
      'requestNo': requestNo,
      'usageNo': usageNo,
    };
  }
}

class CommerceEmptyCommandRequest {


  CommerceEmptyCommandRequest();

  factory CommerceEmptyCommandRequest.fromJson(Map<String, dynamic> json) {
    return CommerceEmptyCommandRequest();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class CommerceExchangeRuleItem {
  final String? id;
  final String? rate;
  final String? sourceAssetType;
  final String? status;
  final String? targetAssetType;

  CommerceExchangeRuleItem({
    this.id,
    this.rate,
    this.sourceAssetType,
    this.status,
    this.targetAssetType
  });

  factory CommerceExchangeRuleItem.fromJson(Map<String, dynamic> json) {
    return CommerceExchangeRuleItem(
      id: json['id']?.toString(),
      rate: json['rate']?.toString(),
      sourceAssetType: json['sourceAssetType']?.toString(),
      status: json['status']?.toString(),
      targetAssetType: json['targetAssetType']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'rate': rate,
      'sourceAssetType': sourceAssetType,
      'status': status,
      'targetAssetType': targetAssetType,
    };
  }
}

class CommerceOperationResponse {
  final String? requestNo;
  final String? status;
  final bool? success;

  CommerceOperationResponse({
    this.requestNo,
    this.status,
    this.success
  });

  factory CommerceOperationResponse.fromJson(Map<String, dynamic> json) {
    return CommerceOperationResponse(
      requestNo: json['requestNo']?.toString(),
      status: json['status']?.toString(),
      success: json['success'] is bool ? json['success'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'requestNo': requestNo,
      'status': status,
      'success': success,
    };
  }
}

class CommercePointsBalanceResponse {
  final int? availablePoints;
  final int? frozenPoints;

  CommercePointsBalanceResponse({
    this.availablePoints,
    this.frozenPoints
  });

  factory CommercePointsBalanceResponse.fromJson(Map<String, dynamic> json) {
    return CommercePointsBalanceResponse(
      availablePoints: json['availablePoints'] is int ? json['availablePoints'] : null,
      frozenPoints: json['frozenPoints'] is int ? json['frozenPoints'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'availablePoints': availablePoints,
      'frozenPoints': frozenPoints,
    };
  }
}

class CommercePointsExchangeRateResponse {
  final String? rate;
  final String? sourceAssetType;
  final String? targetAssetType;

  CommercePointsExchangeRateResponse({
    this.rate,
    this.sourceAssetType,
    this.targetAssetType
  });

  factory CommercePointsExchangeRateResponse.fromJson(Map<String, dynamic> json) {
    return CommercePointsExchangeRateResponse(
      rate: json['rate']?.toString(),
      sourceAssetType: json['sourceAssetType']?.toString(),
      targetAssetType: json['targetAssetType']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'rate': rate,
      'sourceAssetType': sourceAssetType,
      'targetAssetType': targetAssetType,
    };
  }
}

class CommercePointsHistoryItem {
  final int? amount;
  final int? balanceAfter;
  final String? businessType;
  final String? createdAt;
  final String? direction;
  final String? id;

  CommercePointsHistoryItem({
    this.amount,
    this.balanceAfter,
    this.businessType,
    this.createdAt,
    this.direction,
    this.id
  });

  factory CommercePointsHistoryItem.fromJson(Map<String, dynamic> json) {
    return CommercePointsHistoryItem(
      amount: json['amount'] is int ? json['amount'] : null,
      balanceAfter: json['balanceAfter'] is int ? json['balanceAfter'] : null,
      businessType: json['businessType']?.toString(),
      createdAt: json['createdAt']?.toString(),
      direction: json['direction']?.toString(),
      id: json['id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'balanceAfter': balanceAfter,
      'businessType': businessType,
      'createdAt': createdAt,
      'direction': direction,
      'id': id,
    };
  }
}

class CommercePreflightRequest {
  final String? amount;
  final String? businessType;
  final String? remarks;
  final String? requestNo;

  CommercePreflightRequest({
    this.amount,
    this.businessType,
    this.remarks,
    this.requestNo
  });

  factory CommercePreflightRequest.fromJson(Map<String, dynamic> json) {
    return CommercePreflightRequest(
      amount: json['amount']?.toString(),
      businessType: json['businessType']?.toString(),
      remarks: json['remarks']?.toString(),
      requestNo: json['requestNo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'businessType': businessType,
      'remarks': remarks,
      'requestNo': requestNo,
    };
  }
}

class CommerceRechargeOrderCancelRequest {
  final String? reason;

  CommerceRechargeOrderCancelRequest({
    this.reason
  });

  factory CommerceRechargeOrderCancelRequest.fromJson(Map<String, dynamic> json) {
    return CommerceRechargeOrderCancelRequest(
      reason: json['reason']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'reason': reason,
    };
  }
}

class CommerceTokenBalanceResponse {
  final int? availableTokens;
  final int? frozenTokens;

  CommerceTokenBalanceResponse({
    this.availableTokens,
    this.frozenTokens
  });

  factory CommerceTokenBalanceResponse.fromJson(Map<String, dynamic> json) {
    return CommerceTokenBalanceResponse(
      availableTokens: json['availableTokens'] is int ? json['availableTokens'] : null,
      frozenTokens: json['frozenTokens'] is int ? json['frozenTokens'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'availableTokens': availableTokens,
      'frozenTokens': frozenTokens,
    };
  }
}

class CommerceUsagePricingPlanRecord {
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? id;
  final String? includedQuota;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? overagePricingId;
  final String? planCode;
  final String? planName;
  final String? pricingMode;
  final String? productId;
  final String? rateMultiplier;
  final String? skuId;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;
  final String? vipLevelId;

  CommerceUsagePricingPlanRecord({
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.id,
    this.includedQuota,
    this.metadata,
    this.organizationId,
    this.overagePricingId,
    this.planCode,
    this.planName,
    this.pricingMode,
    this.productId,
    this.rateMultiplier,
    this.skuId,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version,
    this.vipLevelId
  });

  factory CommerceUsagePricingPlanRecord.fromJson(Map<String, dynamic> json) {
    return CommerceUsagePricingPlanRecord(
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      id: json['id']?.toString(),
      includedQuota: json['included_quota']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      overagePricingId: json['overage_pricing_id']?.toString(),
      planCode: json['plan_code']?.toString(),
      planName: json['plan_name']?.toString(),
      pricingMode: json['pricing_mode']?.toString(),
      productId: json['product_id']?.toString(),
      rateMultiplier: json['rate_multiplier']?.toString(),
      skuId: json['sku_id']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      vipLevelId: json['vip_level_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'id': id,
      'included_quota': includedQuota,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'overage_pricing_id': overagePricingId,
      'plan_code': planCode,
      'plan_name': planName,
      'pricing_mode': pricingMode,
      'product_id': productId,
      'rate_multiplier': rateMultiplier,
      'sku_id': skuId,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
      'vip_level_id': vipLevelId,
    };
  }
}

class CommerceUsageSettlementRecord {
  final String? accountHistoryId;
  final String? accountId;
  final String? amount;
  final String? assetType;
  final String? createdAt;
  final String? currency;
  final String? direction;
  final String? failureCode;
  final String? failureMessage;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? orderId;
  final String? organizationId;
  final String? payloadHash;
  final String? paymentId;
  final String? points;
  final Map<String, dynamic>? priceSnapshot;
  final String? requestId;
  final String? retentionUntil;
  final String? settledAt;
  final String? settlementNo;
  final String? settlementStatus;
  final String? status;
  final String? tenantId;
  final String? tokens;
  final String? traceId;
  final String? usageFactId;
  final String? userId;
  final String? uuid;

  CommerceUsageSettlementRecord({
    this.accountHistoryId,
    this.accountId,
    this.amount,
    this.assetType,
    this.createdAt,
    this.currency,
    this.direction,
    this.failureCode,
    this.failureMessage,
    this.id,
    this.legalHold,
    this.metadata,
    this.orderId,
    this.organizationId,
    this.payloadHash,
    this.paymentId,
    this.points,
    this.priceSnapshot,
    this.requestId,
    this.retentionUntil,
    this.settledAt,
    this.settlementNo,
    this.settlementStatus,
    this.status,
    this.tenantId,
    this.tokens,
    this.traceId,
    this.usageFactId,
    this.userId,
    this.uuid
  });

  factory CommerceUsageSettlementRecord.fromJson(Map<String, dynamic> json) {
    return CommerceUsageSettlementRecord(
      accountHistoryId: json['account_history_id']?.toString(),
      accountId: json['account_id']?.toString(),
      amount: json['amount']?.toString(),
      assetType: json['asset_type']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      direction: json['direction']?.toString(),
      failureCode: json['failure_code']?.toString(),
      failureMessage: json['failure_message']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      orderId: json['order_id']?.toString(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      paymentId: json['payment_id']?.toString(),
      points: json['points']?.toString(),
      priceSnapshot: (() {
        final map = _sdkworkAsMap(json['price_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      settledAt: json['settled_at']?.toString(),
      settlementNo: json['settlement_no']?.toString(),
      settlementStatus: json['settlement_status']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      tokens: json['tokens']?.toString(),
      traceId: json['trace_id']?.toString(),
      usageFactId: json['usage_fact_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'account_history_id': accountHistoryId,
      'account_id': accountId,
      'amount': amount,
      'asset_type': assetType,
      'created_at': createdAt,
      'currency': currency,
      'direction': direction,
      'failure_code': failureCode,
      'failure_message': failureMessage,
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'order_id': orderId,
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'payment_id': paymentId,
      'points': points,
      'price_snapshot': priceSnapshot?.map((key, item) => MapEntry(key, item)),
      'request_id': requestId,
      'retention_until': retentionUntil,
      'settled_at': settledAt,
      'settlement_no': settlementNo,
      'settlement_status': settlementStatus,
      'status': status,
      'tenant_id': tenantId,
      'tokens': tokens,
      'trace_id': traceId,
      'usage_fact_id': usageFactId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class CommerceUsageStatementItemRecord {
  final String? assetCount;
  final Map<String, dynamic>? breakdownPayload;
  final String? costAmount;
  final String? createdAt;
  final String? currency;
  final String? durationSeconds;
  final String? id;
  final String? itemType;
  final Map<String, dynamic>? metadata;
  final String? modality;
  final String? model;
  final Map<String, dynamic>? modelList;
  final String? organizationId;
  final String? providerCode;
  final String? rebuildVersion;
  final String? requestCount;
  final String? sourceId;
  final String? sourceType;
  final Map<String, dynamic>? sourceUsageFactIds;
  final String? sourceVersion;
  final String? statementId;
  final String? status;
  final String? tenantId;
  final String? tokenCount;
  final String? updatedAt;
  final String? usageText;
  final String? uuid;

  CommerceUsageStatementItemRecord({
    this.assetCount,
    this.breakdownPayload,
    this.costAmount,
    this.createdAt,
    this.currency,
    this.durationSeconds,
    this.id,
    this.itemType,
    this.metadata,
    this.modality,
    this.model,
    this.modelList,
    this.organizationId,
    this.providerCode,
    this.rebuildVersion,
    this.requestCount,
    this.sourceId,
    this.sourceType,
    this.sourceUsageFactIds,
    this.sourceVersion,
    this.statementId,
    this.status,
    this.tenantId,
    this.tokenCount,
    this.updatedAt,
    this.usageText,
    this.uuid
  });

  factory CommerceUsageStatementItemRecord.fromJson(Map<String, dynamic> json) {
    return CommerceUsageStatementItemRecord(
      assetCount: json['asset_count']?.toString(),
      breakdownPayload: (() {
        final map = _sdkworkAsMap(json['breakdown_payload']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      costAmount: json['cost_amount']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      durationSeconds: json['duration_seconds']?.toString(),
      id: json['id']?.toString(),
      itemType: json['item_type']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modality: json['modality']?.toString(),
      model: json['model']?.toString(),
      modelList: (() {
        final map = _sdkworkAsMap(json['model_list']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      providerCode: json['provider_code']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      requestCount: json['request_count']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceUsageFactIds: (() {
        final map = _sdkworkAsMap(json['source_usage_fact_ids']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      sourceVersion: json['source_version']?.toString(),
      statementId: json['statement_id']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      tokenCount: json['token_count']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      usageText: json['usage_text']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'asset_count': assetCount,
      'breakdown_payload': breakdownPayload?.map((key, item) => MapEntry(key, item)),
      'cost_amount': costAmount,
      'created_at': createdAt,
      'currency': currency,
      'duration_seconds': durationSeconds,
      'id': id,
      'item_type': itemType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'modality': modality,
      'model': model,
      'model_list': modelList?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'provider_code': providerCode,
      'rebuild_version': rebuildVersion,
      'request_count': requestCount,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_usage_fact_ids': sourceUsageFactIds?.map((key, item) => MapEntry(key, item)),
      'source_version': sourceVersion,
      'statement_id': statementId,
      'status': status,
      'tenant_id': tenantId,
      'token_count': tokenCount,
      'updated_at': updatedAt,
      'usage_text': usageText,
      'uuid': uuid,
    };
  }
}

class CommerceUsageStatementRecord {
  final String? createdAt;
  final String? currency;
  final String? dueAt;
  final String? exportId;
  final String? generatedAt;
  final String? id;
  final String? invoiceId;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final String? paidAt;
  final String? paymentStatus;
  final String? period;
  final String? periodEnd;
  final String? periodStart;
  final String? rebuildVersion;
  final String? sourceId;
  final String? sourceType;
  final String? sourceVersion;
  final String? statementNo;
  final String? statementStatus;
  final String? status;
  final String? tenantId;
  final String? totalCost;
  final String? totalRequests;
  final String? totalTokens;
  final String? updatedAt;
  final String? uuid;

  CommerceUsageStatementRecord({
    this.createdAt,
    this.currency,
    this.dueAt,
    this.exportId,
    this.generatedAt,
    this.id,
    this.invoiceId,
    this.metadata,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.paidAt,
    this.paymentStatus,
    this.period,
    this.periodEnd,
    this.periodStart,
    this.rebuildVersion,
    this.sourceId,
    this.sourceType,
    this.sourceVersion,
    this.statementNo,
    this.statementStatus,
    this.status,
    this.tenantId,
    this.totalCost,
    this.totalRequests,
    this.totalTokens,
    this.updatedAt,
    this.uuid
  });

  factory CommerceUsageStatementRecord.fromJson(Map<String, dynamic> json) {
    return CommerceUsageStatementRecord(
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      dueAt: json['due_at']?.toString(),
      exportId: json['export_id']?.toString(),
      generatedAt: json['generated_at']?.toString(),
      id: json['id']?.toString(),
      invoiceId: json['invoice_id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      paidAt: json['paid_at']?.toString(),
      paymentStatus: json['payment_status']?.toString(),
      period: json['period']?.toString(),
      periodEnd: json['period_end']?.toString(),
      periodStart: json['period_start']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      statementNo: json['statement_no']?.toString(),
      statementStatus: json['statement_status']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      totalCost: json['total_cost']?.toString(),
      totalRequests: json['total_requests']?.toString(),
      totalTokens: json['total_tokens']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'currency': currency,
      'due_at': dueAt,
      'export_id': exportId,
      'generated_at': generatedAt,
      'id': id,
      'invoice_id': invoiceId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'paid_at': paidAt,
      'payment_status': paymentStatus,
      'period': period,
      'period_end': periodEnd,
      'period_start': periodStart,
      'rebuild_version': rebuildVersion,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'statement_no': statementNo,
      'statement_status': statementStatus,
      'status': status,
      'tenant_id': tenantId,
      'total_cost': totalCost,
      'total_requests': totalRequests,
      'total_tokens': totalTokens,
      'updated_at': updatedAt,
      'uuid': uuid,
    };
  }
}

class CommerceVipBenefitItem {
  final String? benefitType;
  final String? code;
  final String? id;
  final String? name;
  final String? status;

  CommerceVipBenefitItem({
    this.benefitType,
    this.code,
    this.id,
    this.name,
    this.status
  });

  factory CommerceVipBenefitItem.fromJson(Map<String, dynamic> json) {
    return CommerceVipBenefitItem(
      benefitType: json['benefitType']?.toString(),
      code: json['code']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'benefitType': benefitType,
      'code': code,
      'id': id,
      'name': name,
      'status': status,
    };
  }
}

class CommerceVipDailyRewardStatusResponse {
  final bool? available;
  final bool? claimedToday;

  CommerceVipDailyRewardStatusResponse({
    this.available,
    this.claimedToday
  });

  factory CommerceVipDailyRewardStatusResponse.fromJson(Map<String, dynamic> json) {
    return CommerceVipDailyRewardStatusResponse(
      available: json['available'] is bool ? json['available'] : null,
      claimedToday: json['claimedToday'] is bool ? json['claimedToday'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'available': available,
      'claimedToday': claimedToday,
    };
  }
}

class CommerceVipInfoResponse {
  final String? levelCode;
  final String? levelName;
  final String? status;

  CommerceVipInfoResponse({
    this.levelCode,
    this.levelName,
    this.status
  });

  factory CommerceVipInfoResponse.fromJson(Map<String, dynamic> json) {
    return CommerceVipInfoResponse(
      levelCode: json['levelCode']?.toString(),
      levelName: json['levelName']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'levelCode': levelCode,
      'levelName': levelName,
      'status': status,
    };
  }
}

class CommerceVipLevelItem {
  final String? code;
  final String? id;
  final String? name;
  final int? rank;
  final String? status;

  CommerceVipLevelItem({
    this.code,
    this.id,
    this.name,
    this.rank,
    this.status
  });

  factory CommerceVipLevelItem.fromJson(Map<String, dynamic> json) {
    return CommerceVipLevelItem(
      code: json['code']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      rank: json['rank'] is int ? json['rank'] : null,
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'id': id,
      'name': name,
      'rank': rank,
      'status': status,
    };
  }
}

class CommerceVipPackGroupItem {
  final String? code;
  final String? id;
  final String? name;
  final int? sortOrder;
  final String? status;

  CommerceVipPackGroupItem({
    this.code,
    this.id,
    this.name,
    this.sortOrder,
    this.status
  });

  factory CommerceVipPackGroupItem.fromJson(Map<String, dynamic> json) {
    return CommerceVipPackGroupItem(
      code: json['code']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      sortOrder: json['sortOrder'] is int ? json['sortOrder'] : null,
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'id': id,
      'name': name,
      'sortOrder': sortOrder,
      'status': status,
    };
  }
}

class CommerceVipPackItem {
  final String? code;
  final String? currencyCode;
  final String? id;
  final String? name;
  final String? priceAmount;
  final String? status;

  CommerceVipPackItem({
    this.code,
    this.currencyCode,
    this.id,
    this.name,
    this.priceAmount,
    this.status
  });

  factory CommerceVipPackItem.fromJson(Map<String, dynamic> json) {
    return CommerceVipPackItem(
      code: json['code']?.toString(),
      currencyCode: json['currencyCode']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      priceAmount: json['priceAmount']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'currencyCode': currencyCode,
      'id': id,
      'name': name,
      'priceAmount': priceAmount,
      'status': status,
    };
  }
}

class CommerceVipPrivilegeSpeedUpRequest {
  final String? privilegeCode;
  final String? remarks;
  final String? requestNo;

  CommerceVipPrivilegeSpeedUpRequest({
    this.privilegeCode,
    this.remarks,
    this.requestNo
  });

  factory CommerceVipPrivilegeSpeedUpRequest.fromJson(Map<String, dynamic> json) {
    return CommerceVipPrivilegeSpeedUpRequest(
      privilegeCode: json['privilegeCode']?.toString(),
      remarks: json['remarks']?.toString(),
      requestNo: json['requestNo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'privilegeCode': privilegeCode,
      'remarks': remarks,
      'requestNo': requestNo,
    };
  }
}

class CommerceVipPrivilegeUsageItem {
  final String? periodKey;
  final String? privilegeCode;
  final int? quotaCount;
  final int? usedCount;

  CommerceVipPrivilegeUsageItem({
    this.periodKey,
    this.privilegeCode,
    this.quotaCount,
    this.usedCount
  });

  factory CommerceVipPrivilegeUsageItem.fromJson(Map<String, dynamic> json) {
    return CommerceVipPrivilegeUsageItem(
      periodKey: json['periodKey']?.toString(),
      privilegeCode: json['privilegeCode']?.toString(),
      quotaCount: json['quotaCount'] is int ? json['quotaCount'] : null,
      usedCount: json['usedCount'] is int ? json['usedCount'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'periodKey': periodKey,
      'privilegeCode': privilegeCode,
      'quotaCount': quotaCount,
      'usedCount': usedCount,
    };
  }
}

class CommerceVipPurchaseRequest {
  final String? packId;
  final String? remarks;
  final String? requestNo;

  CommerceVipPurchaseRequest({
    this.packId,
    this.remarks,
    this.requestNo
  });

  factory CommerceVipPurchaseRequest.fromJson(Map<String, dynamic> json) {
    return CommerceVipPurchaseRequest(
      packId: json['packId']?.toString(),
      remarks: json['remarks']?.toString(),
      requestNo: json['requestNo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'packId': packId,
      'remarks': remarks,
      'requestNo': requestNo,
    };
  }
}

class CommerceWalletAccountItem {
  final String? assetType;
  final String? availableAmount;
  final String? currencyCode;
  final String? frozenAmount;
  final String? id;
  final String? status;

  CommerceWalletAccountItem({
    this.assetType,
    this.availableAmount,
    this.currencyCode,
    this.frozenAmount,
    this.id,
    this.status
  });

  factory CommerceWalletAccountItem.fromJson(Map<String, dynamic> json) {
    return CommerceWalletAccountItem(
      assetType: json['assetType']?.toString(),
      availableAmount: json['availableAmount']?.toString(),
      currencyCode: json['currencyCode']?.toString(),
      frozenAmount: json['frozenAmount']?.toString(),
      id: json['id']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'assetType': assetType,
      'availableAmount': availableAmount,
      'currencyCode': currencyCode,
      'frozenAmount': frozenAmount,
      'id': id,
      'status': status,
    };
  }
}

class CommerceWalletCommandRequest {
  final String? amount;
  final String? assetType;
  final String? remarks;
  final String? requestNo;

  CommerceWalletCommandRequest({
    this.amount,
    this.assetType,
    this.remarks,
    this.requestNo
  });

  factory CommerceWalletCommandRequest.fromJson(Map<String, dynamic> json) {
    return CommerceWalletCommandRequest(
      amount: json['amount']?.toString(),
      assetType: json['assetType']?.toString(),
      remarks: json['remarks']?.toString(),
      requestNo: json['requestNo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'assetType': assetType,
      'remarks': remarks,
      'requestNo': requestNo,
    };
  }
}

class CommerceWalletOverviewResponse {
  final String? availableAmount;
  final String? currencyCode;
  final String? frozenAmount;

  CommerceWalletOverviewResponse({
    this.availableAmount,
    this.currencyCode,
    this.frozenAmount
  });

  factory CommerceWalletOverviewResponse.fromJson(Map<String, dynamic> json) {
    return CommerceWalletOverviewResponse(
      availableAmount: json['availableAmount']?.toString(),
      currencyCode: json['currencyCode']?.toString(),
      frozenAmount: json['frozenAmount']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'availableAmount': availableAmount,
      'currencyCode': currencyCode,
      'frozenAmount': frozenAmount,
    };
  }
}

class CommerceWalletTransactionItem {
  final String? amount;
  final String? balanceAfter;
  final String? businessType;
  final String? createdAt;
  final String? direction;
  final String? id;
  final String? transactionNo;

  CommerceWalletTransactionItem({
    this.amount,
    this.balanceAfter,
    this.businessType,
    this.createdAt,
    this.direction,
    this.id,
    this.transactionNo
  });

  factory CommerceWalletTransactionItem.fromJson(Map<String, dynamic> json) {
    return CommerceWalletTransactionItem(
      amount: json['amount']?.toString(),
      balanceAfter: json['balanceAfter']?.toString(),
      businessType: json['businessType']?.toString(),
      createdAt: json['createdAt']?.toString(),
      direction: json['direction']?.toString(),
      id: json['id']?.toString(),
      transactionNo: json['transactionNo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'balanceAfter': balanceAfter,
      'businessType': businessType,
      'createdAt': createdAt,
      'direction': direction,
      'id': id,
      'transactionNo': transactionNo,
    };
  }
}

class ContentAnnouncementRecord {
  final String? announcementType;
  final Map<String, dynamic>? audienceFilter;
  final String? content;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final bool? pinned;
  final String? publishedAt;
  final String? status;
  final String? targetScope;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  ContentAnnouncementRecord({
    this.announcementType,
    this.audienceFilter,
    this.content,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.id,
    this.metadata,
    this.organizationId,
    this.pinned,
    this.publishedAt,
    this.status,
    this.targetScope,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory ContentAnnouncementRecord.fromJson(Map<String, dynamic> json) {
    return ContentAnnouncementRecord(
      announcementType: json['announcement_type']?.toString(),
      audienceFilter: (() {
        final map = _sdkworkAsMap(json['audience_filter']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      content: json['content']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      pinned: json['pinned'] is bool ? json['pinned'] : null,
      publishedAt: json['published_at']?.toString(),
      status: json['status']?.toString(),
      targetScope: json['target_scope']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'announcement_type': announcementType,
      'audience_filter': audienceFilter?.map((key, item) => MapEntry(key, item)),
      'content': content,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'pinned': pinned,
      'published_at': publishedAt,
      'status': status,
      'target_scope': targetScope,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class ContentCourseApplicationRecord {
  final String? category;
  final String? contactEmail;
  final String? contactName;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? externalBvid;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final String? reviewComment;
  final String? reviewedAt;
  final String? reviewedBy;
  final String? sourceProvider;
  final String? status;
  final String? submittedAt;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;
  final String? videoUrl;

  ContentCourseApplicationRecord({
    this.category,
    this.contactEmail,
    this.contactName,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.externalBvid,
    this.id,
    this.metadata,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.reviewComment,
    this.reviewedAt,
    this.reviewedBy,
    this.sourceProvider,
    this.status,
    this.submittedAt,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version,
    this.videoUrl
  });

  factory ContentCourseApplicationRecord.fromJson(Map<String, dynamic> json) {
    return ContentCourseApplicationRecord(
      category: json['category']?.toString(),
      contactEmail: json['contact_email']?.toString(),
      contactName: json['contact_name']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      externalBvid: json['external_bvid']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      reviewComment: json['review_comment']?.toString(),
      reviewedAt: json['reviewed_at']?.toString(),
      reviewedBy: json['reviewed_by']?.toString(),
      sourceProvider: json['source_provider']?.toString(),
      status: json['status']?.toString(),
      submittedAt: json['submitted_at']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      videoUrl: json['video_url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'contact_email': contactEmail,
      'contact_name': contactName,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'external_bvid': externalBvid,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'review_comment': reviewComment,
      'reviewed_at': reviewedAt,
      'reviewed_by': reviewedBy,
      'source_provider': sourceProvider,
      'status': status,
      'submitted_at': submittedAt,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
      'video_url': videoUrl,
    };
  }
}

class ContentCourseLessonRecord {
  final String? content;
  final String? courseId;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? durationSeconds;
  final String? durationText;
  final String? externalBvid;
  final bool? freePreview;
  final String? id;
  final int? lessonNo;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? sectionId;
  final int? sortOrder;
  final String? sourceProvider;
  final String? status;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;
  final String? videoUrl;

  ContentCourseLessonRecord({
    this.content,
    this.courseId,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.durationSeconds,
    this.durationText,
    this.externalBvid,
    this.freePreview,
    this.id,
    this.lessonNo,
    this.metadata,
    this.organizationId,
    this.sectionId,
    this.sortOrder,
    this.sourceProvider,
    this.status,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version,
    this.videoUrl
  });

  factory ContentCourseLessonRecord.fromJson(Map<String, dynamic> json) {
    return ContentCourseLessonRecord(
      content: json['content']?.toString(),
      courseId: json['course_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      durationSeconds: json['duration_seconds']?.toString(),
      durationText: json['duration_text']?.toString(),
      externalBvid: json['external_bvid']?.toString(),
      freePreview: json['free_preview'] is bool ? json['free_preview'] : null,
      id: json['id']?.toString(),
      lessonNo: json['lesson_no'] is int ? json['lesson_no'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      sectionId: json['section_id']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      sourceProvider: json['source_provider']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      videoUrl: json['video_url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'course_id': courseId,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'duration_seconds': durationSeconds,
      'duration_text': durationText,
      'external_bvid': externalBvid,
      'free_preview': freePreview,
      'id': id,
      'lesson_no': lessonNo,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'section_id': sectionId,
      'sort_order': sortOrder,
      'source_provider': sourceProvider,
      'status': status,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
      'video_url': videoUrl,
    };
  }
}

class ContentCourseRecord {
  final String? category;
  final String? content;
  final String? courseCode;
  final String? createdAt;
  final String? currency;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? durationText;
  final String? externalBvid;
  final String? id;
  final Map<String, dynamic>? instructorSnapshot;
  final bool? isCollection;
  final int? lessonsCount;
  final String? level;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? priceAmount;
  final String? publishedAt;
  final String? ratingScore;
  final String? status;
  final String? studentsCount;
  final Map<String, dynamic>? tags;
  final String? tenantId;
  final String? thumbnailUrl;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  ContentCourseRecord({
    this.category,
    this.content,
    this.courseCode,
    this.createdAt,
    this.currency,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.durationText,
    this.externalBvid,
    this.id,
    this.instructorSnapshot,
    this.isCollection,
    this.lessonsCount,
    this.level,
    this.metadata,
    this.organizationId,
    this.priceAmount,
    this.publishedAt,
    this.ratingScore,
    this.status,
    this.studentsCount,
    this.tags,
    this.tenantId,
    this.thumbnailUrl,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory ContentCourseRecord.fromJson(Map<String, dynamic> json) {
    return ContentCourseRecord(
      category: json['category']?.toString(),
      content: json['content']?.toString(),
      courseCode: json['course_code']?.toString(),
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      durationText: json['duration_text']?.toString(),
      externalBvid: json['external_bvid']?.toString(),
      id: json['id']?.toString(),
      instructorSnapshot: (() {
        final map = _sdkworkAsMap(json['instructor_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      isCollection: json['is_collection'] is bool ? json['is_collection'] : null,
      lessonsCount: json['lessons_count'] is int ? json['lessons_count'] : null,
      level: json['level']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      priceAmount: json['price_amount']?.toString(),
      publishedAt: json['published_at']?.toString(),
      ratingScore: json['rating_score']?.toString(),
      status: json['status']?.toString(),
      studentsCount: json['students_count']?.toString(),
      tags: (() {
        final map = _sdkworkAsMap(json['tags']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      tenantId: json['tenant_id']?.toString(),
      thumbnailUrl: json['thumbnail_url']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'content': content,
      'course_code': courseCode,
      'created_at': createdAt,
      'currency': currency,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'duration_text': durationText,
      'external_bvid': externalBvid,
      'id': id,
      'instructor_snapshot': instructorSnapshot?.map((key, item) => MapEntry(key, item)),
      'is_collection': isCollection,
      'lessons_count': lessonsCount,
      'level': level,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'price_amount': priceAmount,
      'published_at': publishedAt,
      'rating_score': ratingScore,
      'status': status,
      'students_count': studentsCount,
      'tags': tags?.map((key, item) => MapEntry(key, item)),
      'tenant_id': tenantId,
      'thumbnail_url': thumbnailUrl,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class ContentCourseRelationRecord {
  final String? courseId;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? relatedCourseId;
  final String? relationType;
  final int? sortOrder;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  ContentCourseRelationRecord({
    this.courseId,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.id,
    this.metadata,
    this.organizationId,
    this.relatedCourseId,
    this.relationType,
    this.sortOrder,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory ContentCourseRelationRecord.fromJson(Map<String, dynamic> json) {
    return ContentCourseRelationRecord(
      courseId: json['course_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      relatedCourseId: json['related_course_id']?.toString(),
      relationType: json['relation_type']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'course_id': courseId,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'related_course_id': relatedCourseId,
      'relation_type': relationType,
      'sort_order': sortOrder,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class ContentCourseSectionRecord {
  final String? courseId;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? durationSeconds;
  final String? id;
  final int? lessonCount;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final int? sectionNo;
  final int? sortOrder;
  final String? status;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  ContentCourseSectionRecord({
    this.courseId,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.durationSeconds,
    this.id,
    this.lessonCount,
    this.metadata,
    this.organizationId,
    this.sectionNo,
    this.sortOrder,
    this.status,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory ContentCourseSectionRecord.fromJson(Map<String, dynamic> json) {
    return ContentCourseSectionRecord(
      courseId: json['course_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      durationSeconds: json['duration_seconds']?.toString(),
      id: json['id']?.toString(),
      lessonCount: json['lesson_count'] is int ? json['lesson_count'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      sectionNo: json['section_no'] is int ? json['section_no'] : null,
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'course_id': courseId,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'duration_seconds': durationSeconds,
      'id': id,
      'lesson_count': lessonCount,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'section_no': sectionNo,
      'sort_order': sortOrder,
      'status': status,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class ContentDocPageRecord {
  final String? contentHash;
  final String? contentSource;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? docCode;
  final String? docType;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? path;
  final String? publishedAt;
  final String? slug;
  final int? sortOrder;
  final String? sourceRef;
  final String? status;
  final String? summary;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  ContentDocPageRecord({
    this.contentHash,
    this.contentSource,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.docCode,
    this.docType,
    this.id,
    this.metadata,
    this.organizationId,
    this.path,
    this.publishedAt,
    this.slug,
    this.sortOrder,
    this.sourceRef,
    this.status,
    this.summary,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory ContentDocPageRecord.fromJson(Map<String, dynamic> json) {
    return ContentDocPageRecord(
      contentHash: json['content_hash']?.toString(),
      contentSource: json['content_source']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      docCode: json['doc_code']?.toString(),
      docType: json['doc_type']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      path: json['path']?.toString(),
      publishedAt: json['published_at']?.toString(),
      slug: json['slug']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      sourceRef: json['source_ref']?.toString(),
      status: json['status']?.toString(),
      summary: json['summary']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content_hash': contentHash,
      'content_source': contentSource,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'doc_code': docCode,
      'doc_type': docType,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'path': path,
      'published_at': publishedAt,
      'slug': slug,
      'sort_order': sortOrder,
      'source_ref': sourceRef,
      'status': status,
      'summary': summary,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class ContentForumCommentRecord {
  final String? authorId;
  final Map<String, dynamic>? authorSnapshot;
  final String? body;
  final String? courseId;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? id;
  final String? likeCount;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final String? parentId;
  final String? postId;
  final String? rootId;
  final String? status;
  final String? targetId;
  final String? targetType;
  final String? tenantId;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;

  ContentForumCommentRecord({
    this.authorId,
    this.authorSnapshot,
    this.body,
    this.courseId,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.id,
    this.likeCount,
    this.metadata,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.parentId,
    this.postId,
    this.rootId,
    this.status,
    this.targetId,
    this.targetType,
    this.tenantId,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version
  });

  factory ContentForumCommentRecord.fromJson(Map<String, dynamic> json) {
    return ContentForumCommentRecord(
      authorId: json['author_id']?.toString(),
      authorSnapshot: (() {
        final map = _sdkworkAsMap(json['author_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      body: json['body']?.toString(),
      courseId: json['course_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      id: json['id']?.toString(),
      likeCount: json['like_count']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      parentId: json['parent_id']?.toString(),
      postId: json['post_id']?.toString(),
      rootId: json['root_id']?.toString(),
      status: json['status']?.toString(),
      targetId: json['target_id']?.toString(),
      targetType: json['target_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author_id': authorId,
      'author_snapshot': authorSnapshot?.map((key, item) => MapEntry(key, item)),
      'body': body,
      'course_id': courseId,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'id': id,
      'like_count': likeCount,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'parent_id': parentId,
      'post_id': postId,
      'root_id': rootId,
      'status': status,
      'target_id': targetId,
      'target_type': targetType,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
    };
  }
}

class ContentForumPostRecord {
  final String? authorId;
  final Map<String, dynamic>? authorSnapshot;
  final String? body;
  final String? category;
  final String? commentCount;
  final String? contentSnippet;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? id;
  final String? lastRepliedAt;
  final String? likeCount;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final bool? pinned;
  final String? status;
  final Map<String, dynamic>? tags;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;
  final String? viewCount;

  ContentForumPostRecord({
    this.authorId,
    this.authorSnapshot,
    this.body,
    this.category,
    this.commentCount,
    this.contentSnippet,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.id,
    this.lastRepliedAt,
    this.likeCount,
    this.metadata,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.pinned,
    this.status,
    this.tags,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version,
    this.viewCount
  });

  factory ContentForumPostRecord.fromJson(Map<String, dynamic> json) {
    return ContentForumPostRecord(
      authorId: json['author_id']?.toString(),
      authorSnapshot: (() {
        final map = _sdkworkAsMap(json['author_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      body: json['body']?.toString(),
      category: json['category']?.toString(),
      commentCount: json['comment_count']?.toString(),
      contentSnippet: json['content_snippet']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      id: json['id']?.toString(),
      lastRepliedAt: json['last_replied_at']?.toString(),
      likeCount: json['like_count']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      pinned: json['pinned'] is bool ? json['pinned'] : null,
      status: json['status']?.toString(),
      tags: (() {
        final map = _sdkworkAsMap(json['tags']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      viewCount: json['view_count']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author_id': authorId,
      'author_snapshot': authorSnapshot?.map((key, item) => MapEntry(key, item)),
      'body': body,
      'category': category,
      'comment_count': commentCount,
      'content_snippet': contentSnippet,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'id': id,
      'last_replied_at': lastRepliedAt,
      'like_count': likeCount,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'pinned': pinned,
      'status': status,
      'tags': tags?.map((key, item) => MapEntry(key, item)),
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
      'view_count': viewCount,
    };
  }
}

class ContentOpenapiSnapshotRecord {
  final String? apiSurface;
  final String? apiSystem;
  final Map<String, dynamic>? categoryTree;
  final String? createdAt;
  final int? endpointCount;
  final Map<String, dynamic>? exampleManifest;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? openapiHash;
  final String? organizationId;
  final String? publishedAt;
  final String? rebuildVersion;
  final String? sourceId;
  final String? sourceRef;
  final String? sourceType;
  final String? sourceVersion;
  final String? status;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  ContentOpenapiSnapshotRecord({
    this.apiSurface,
    this.apiSystem,
    this.categoryTree,
    this.createdAt,
    this.endpointCount,
    this.exampleManifest,
    this.id,
    this.metadata,
    this.openapiHash,
    this.organizationId,
    this.publishedAt,
    this.rebuildVersion,
    this.sourceId,
    this.sourceRef,
    this.sourceType,
    this.sourceVersion,
    this.status,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory ContentOpenapiSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return ContentOpenapiSnapshotRecord(
      apiSurface: json['api_surface']?.toString(),
      apiSystem: json['api_system']?.toString(),
      categoryTree: (() {
        final map = _sdkworkAsMap(json['category_tree']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      createdAt: json['created_at']?.toString(),
      endpointCount: json['endpoint_count'] is int ? json['endpoint_count'] : null,
      exampleManifest: (() {
        final map = _sdkworkAsMap(json['example_manifest']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      openapiHash: json['openapi_hash']?.toString(),
      organizationId: json['organization_id']?.toString(),
      publishedAt: json['published_at']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceRef: json['source_ref']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'api_surface': apiSurface,
      'api_system': apiSystem,
      'category_tree': categoryTree?.map((key, item) => MapEntry(key, item)),
      'created_at': createdAt,
      'endpoint_count': endpointCount,
      'example_manifest': exampleManifest?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'openapi_hash': openapiHash,
      'organization_id': organizationId,
      'published_at': publishedAt,
      'rebuild_version': rebuildVersion,
      'source_id': sourceId,
      'source_ref': sourceRef,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'status': status,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class ContentReactionRecord {
  final String? cancelledAt;
  final String? clientIpHash;
  final String? createdAt;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? reactionType;
  final String? reactionValue;
  final String? requestId;
  final String? retentionUntil;
  final String? status;
  final String? targetId;
  final String? targetType;
  final String? tenantId;
  final String? traceId;
  final String? userAgentHash;
  final String? userId;
  final String? uuid;

  ContentReactionRecord({
    this.cancelledAt,
    this.clientIpHash,
    this.createdAt,
    this.id,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.reactionType,
    this.reactionValue,
    this.requestId,
    this.retentionUntil,
    this.status,
    this.targetId,
    this.targetType,
    this.tenantId,
    this.traceId,
    this.userAgentHash,
    this.userId,
    this.uuid
  });

  factory ContentReactionRecord.fromJson(Map<String, dynamic> json) {
    return ContentReactionRecord(
      cancelledAt: json['cancelled_at']?.toString(),
      clientIpHash: json['client_ip_hash']?.toString(),
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      reactionType: json['reaction_type']?.toString(),
      reactionValue: json['reaction_value']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      status: json['status']?.toString(),
      targetId: json['target_id']?.toString(),
      targetType: json['target_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userAgentHash: json['user_agent_hash']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cancelled_at': cancelledAt,
      'client_ip_hash': clientIpHash,
      'created_at': createdAt,
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'reaction_type': reactionType,
      'reaction_value': reactionValue,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'status': status,
      'target_id': targetId,
      'target_type': targetType,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_agent_hash': userAgentHash,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class ContentSdkReleaseRecord {
  final String? apiSystem;
  final Map<String, dynamic>? artifactManifest;
  final String? createdAt;
  final String? dataScope;
  final String? defaultBaseUrl;
  final String? deletedAt;
  final String? deletedBy;
  final String? docsUrl;
  final String? exampleCode;
  final Map<String, dynamic>? exampleManifest;
  final String? githubUrl;
  final String? id;
  final String? importCode;
  final String? initCode;
  final String? installCommand;
  final String? language;
  final String? languageDescription;
  final String? languageIcon;
  final Map<String, dynamic>? metadata;
  final String? openapiSnapshotId;
  final String? organizationId;
  final String? packageManager;
  final String? packageName;
  final String? publishedAt;
  final String? sourceRepo;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  ContentSdkReleaseRecord({
    this.apiSystem,
    this.artifactManifest,
    this.createdAt,
    this.dataScope,
    this.defaultBaseUrl,
    this.deletedAt,
    this.deletedBy,
    this.docsUrl,
    this.exampleCode,
    this.exampleManifest,
    this.githubUrl,
    this.id,
    this.importCode,
    this.initCode,
    this.installCommand,
    this.language,
    this.languageDescription,
    this.languageIcon,
    this.metadata,
    this.openapiSnapshotId,
    this.organizationId,
    this.packageManager,
    this.packageName,
    this.publishedAt,
    this.sourceRepo,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory ContentSdkReleaseRecord.fromJson(Map<String, dynamic> json) {
    return ContentSdkReleaseRecord(
      apiSystem: json['api_system']?.toString(),
      artifactManifest: (() {
        final map = _sdkworkAsMap(json['artifact_manifest']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultBaseUrl: json['default_base_url']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      docsUrl: json['docs_url']?.toString(),
      exampleCode: json['example_code']?.toString(),
      exampleManifest: (() {
        final map = _sdkworkAsMap(json['example_manifest']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      githubUrl: json['github_url']?.toString(),
      id: json['id']?.toString(),
      importCode: json['import_code']?.toString(),
      initCode: json['init_code']?.toString(),
      installCommand: json['install_command']?.toString(),
      language: json['language']?.toString(),
      languageDescription: json['language_description']?.toString(),
      languageIcon: json['language_icon']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      openapiSnapshotId: json['openapi_snapshot_id']?.toString(),
      organizationId: json['organization_id']?.toString(),
      packageManager: json['package_manager']?.toString(),
      packageName: json['package_name']?.toString(),
      publishedAt: json['published_at']?.toString(),
      sourceRepo: json['source_repo']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'api_system': apiSystem,
      'artifact_manifest': artifactManifest?.map((key, item) => MapEntry(key, item)),
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_base_url': defaultBaseUrl,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'docs_url': docsUrl,
      'example_code': exampleCode,
      'example_manifest': exampleManifest?.map((key, item) => MapEntry(key, item)),
      'github_url': githubUrl,
      'id': id,
      'import_code': importCode,
      'init_code': initCode,
      'install_command': installCommand,
      'language': language,
      'language_description': languageDescription,
      'language_icon': languageIcon,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'openapi_snapshot_id': openapiSnapshotId,
      'organization_id': organizationId,
      'package_manager': packageManager,
      'package_name': packageName,
      'published_at': publishedAt,
      'source_repo': sourceRepo,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class CouponsCatalogListResult {
  final String? code;
  final List<CommerceCouponCatalogItem>? data;
  final String? message;
  final String? msg;

  CouponsCatalogListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CouponsCatalogListResult.fromJson(Map<String, dynamic> json) {
    return CouponsCatalogListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceCouponCatalogItem.fromJson(map);
      })())
            .whereType<CommerceCouponCatalogItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class CouponsCatalogRetrieveResult {
  final String? code;
  final CommerceCouponCatalogItem? data;
  final String? message;
  final String? msg;

  CouponsCatalogRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CouponsCatalogRetrieveResult.fromJson(Map<String, dynamic> json) {
    return CouponsCatalogRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceCouponCatalogItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CouponsClaimsCreateResult {
  final String? code;
  final BillingRedeemHistoryItem? data;
  final String? message;
  final String? msg;

  CouponsClaimsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CouponsClaimsCreateResult.fromJson(Map<String, dynamic> json) {
    return CouponsClaimsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : BillingRedeemHistoryItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CouponsRedeemCreateResult {
  final String? code;
  final RedeemCodeResponse? data;
  final String? message;
  final String? msg;

  CouponsRedeemCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CouponsRedeemCreateResult.fromJson(Map<String, dynamic> json) {
    return CouponsRedeemCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RedeemCodeResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CouponsUsageCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  CouponsUsageCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CouponsUsageCreateResult.fromJson(Map<String, dynamic> json) {
    return CouponsUsageCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CouponsUsageReversalsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  CouponsUsageReversalsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CouponsUsageReversalsCreateResult.fromJson(Map<String, dynamic> json) {
    return CouponsUsageReversalsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CourseApplicationCreateRequest {
  final String? category;
  final String? contactEmail;
  final String? contactName;
  final String? description;
  final String? externalBvid;
  final String? notes;
  final String? sourceProvider;
  final String? title;
  final String? videoUrl;

  CourseApplicationCreateRequest({
    this.category,
    this.contactEmail,
    this.contactName,
    this.description,
    this.externalBvid,
    this.notes,
    this.sourceProvider,
    this.title,
    this.videoUrl
  });

  factory CourseApplicationCreateRequest.fromJson(Map<String, dynamic> json) {
    return CourseApplicationCreateRequest(
      category: json['category']?.toString(),
      contactEmail: json['contactEmail']?.toString(),
      contactName: json['contactName']?.toString(),
      description: json['description']?.toString(),
      externalBvid: json['externalBvid']?.toString(),
      notes: json['notes']?.toString(),
      sourceProvider: json['sourceProvider']?.toString(),
      title: json['title']?.toString(),
      videoUrl: json['videoUrl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'contactEmail': contactEmail,
      'contactName': contactName,
      'description': description,
      'externalBvid': externalBvid,
      'notes': notes,
      'sourceProvider': sourceProvider,
      'title': title,
      'videoUrl': videoUrl,
    };
  }
}

class CourseApplicationCreateResponse {
  final int? applicationId;
  final String? category;
  final String? contactEmail;
  final String? contactName;
  final String? description;
  final String? externalBvid;
  final String? id;
  final String? sourceProvider;
  final String? status;
  final String? submittedAt;
  final String? title;
  final String? videoUrl;

  CourseApplicationCreateResponse({
    this.applicationId,
    this.category,
    this.contactEmail,
    this.contactName,
    this.description,
    this.externalBvid,
    this.id,
    this.sourceProvider,
    this.status,
    this.submittedAt,
    this.title,
    this.videoUrl
  });

  factory CourseApplicationCreateResponse.fromJson(Map<String, dynamic> json) {
    return CourseApplicationCreateResponse(
      applicationId: json['applicationId'] is int ? json['applicationId'] : null,
      category: json['category']?.toString(),
      contactEmail: json['contactEmail']?.toString(),
      contactName: json['contactName']?.toString(),
      description: json['description']?.toString(),
      externalBvid: json['externalBvid']?.toString(),
      id: json['id']?.toString(),
      sourceProvider: json['sourceProvider']?.toString(),
      status: json['status']?.toString(),
      submittedAt: json['submittedAt']?.toString(),
      title: json['title']?.toString(),
      videoUrl: json['videoUrl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'applicationId': applicationId,
      'category': category,
      'contactEmail': contactEmail,
      'contactName': contactName,
      'description': description,
      'externalBvid': externalBvid,
      'id': id,
      'sourceProvider': sourceProvider,
      'status': status,
      'submittedAt': submittedAt,
      'title': title,
      'videoUrl': videoUrl,
    };
  }
}

class CourseApplicationVideoUploadRequest {
  final String? file;
  final String? fileName;

  CourseApplicationVideoUploadRequest({
    this.file,
    this.fileName
  });

  factory CourseApplicationVideoUploadRequest.fromJson(Map<String, dynamic> json) {
    return CourseApplicationVideoUploadRequest(
      file: json['file']?.toString(),
      fileName: json['fileName']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'file': file,
      'fileName': fileName,
    };
  }
}

class CourseApplicationVideoUploadResponse {
  final String? contentType;
  final String? fileName;
  final String? sha256;
  final int? sizeBytes;
  final String? uploadedAt;
  final String? videoUrl;

  CourseApplicationVideoUploadResponse({
    this.contentType,
    this.fileName,
    this.sha256,
    this.sizeBytes,
    this.uploadedAt,
    this.videoUrl
  });

  factory CourseApplicationVideoUploadResponse.fromJson(Map<String, dynamic> json) {
    return CourseApplicationVideoUploadResponse(
      contentType: json['contentType']?.toString(),
      fileName: json['fileName']?.toString(),
      sha256: json['sha256']?.toString(),
      sizeBytes: json['sizeBytes'] is int ? json['sizeBytes'] : null,
      uploadedAt: json['uploadedAt']?.toString(),
      videoUrl: json['videoUrl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'contentType': contentType,
      'fileName': fileName,
      'sha256': sha256,
      'sizeBytes': sizeBytes,
      'uploadedAt': uploadedAt,
      'videoUrl': videoUrl,
    };
  }
}

class CourseCategoryItem {
  final String? code;
  final int? courseCount;
  final String? description;
  final String? icon;
  final String? id;
  final String? label;
  final String? name;
  final int? sortWeight;

  CourseCategoryItem({
    this.code,
    this.courseCount,
    this.description,
    this.icon,
    this.id,
    this.label,
    this.name,
    this.sortWeight
  });

  factory CourseCategoryItem.fromJson(Map<String, dynamic> json) {
    return CourseCategoryItem(
      code: json['code']?.toString(),
      courseCount: json['courseCount'] is int ? json['courseCount'] : null,
      description: json['description']?.toString(),
      icon: json['icon']?.toString(),
      id: json['id']?.toString(),
      label: json['label']?.toString(),
      name: json['name']?.toString(),
      sortWeight: json['sortWeight'] is int ? json['sortWeight'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'courseCount': courseCount,
      'description': description,
      'icon': icon,
      'id': id,
      'label': label,
      'name': name,
      'sortWeight': sortWeight,
    };
  }
}

class CourseDetail {
  final String? category;
  final String? categoryLabel;
  final int? commentCount;
  final String? content;
  final int? contentId;
  final String? courseCode;
  final String? currency;
  final String? description;
  final String? durationText;
  final CourseEngagement? engagement;
  final String? externalBvid;
  final String? id;
  final CourseInstructor? instructor;
  final bool? isCollection;
  final int? lessonsCount;
  final int? level;
  final String? levelLabel;
  final String? priceAmount;
  final String? publishedAt;
  final double? ratingScore;
  final List<CourseItem>? relatedCourses;
  final List<CourseSectionItem>? sections;
  final CourseOverviewSource? source;
  final int? studentsCount;
  final List<String>? tags;
  final String? thumbnailUrl;
  final String? title;

  CourseDetail({
    this.category,
    this.categoryLabel,
    this.commentCount,
    this.content,
    this.contentId,
    this.courseCode,
    this.currency,
    this.description,
    this.durationText,
    this.engagement,
    this.externalBvid,
    this.id,
    this.instructor,
    this.isCollection,
    this.lessonsCount,
    this.level,
    this.levelLabel,
    this.priceAmount,
    this.publishedAt,
    this.ratingScore,
    this.relatedCourses,
    this.sections,
    this.source,
    this.studentsCount,
    this.tags,
    this.thumbnailUrl,
    this.title
  });

  factory CourseDetail.fromJson(Map<String, dynamic> json) {
    return CourseDetail(
      category: json['category']?.toString(),
      categoryLabel: json['categoryLabel']?.toString(),
      commentCount: json['commentCount'] is int ? json['commentCount'] : null,
      content: json['content']?.toString(),
      contentId: json['contentId'] is int ? json['contentId'] : null,
      courseCode: json['courseCode']?.toString(),
      currency: json['currency']?.toString(),
      description: json['description']?.toString(),
      durationText: json['durationText']?.toString(),
      engagement: (() {
        final map = _sdkworkAsMap(json['engagement']);
        return map == null ? null : CourseEngagement.fromJson(map);
      })(),
      externalBvid: json['externalBvid']?.toString(),
      id: json['id']?.toString(),
      instructor: (() {
        final map = _sdkworkAsMap(json['instructor']);
        return map == null ? null : CourseInstructor.fromJson(map);
      })(),
      isCollection: json['isCollection'] is bool ? json['isCollection'] : null,
      lessonsCount: json['lessonsCount'] is int ? json['lessonsCount'] : null,
      level: json['level'] is int ? json['level'] : null,
      levelLabel: json['levelLabel']?.toString(),
      priceAmount: json['priceAmount']?.toString(),
      publishedAt: json['publishedAt']?.toString(),
      ratingScore: json['ratingScore'] is num ? json['ratingScore'].toDouble() : null,
      relatedCourses: (() {
        final list = _sdkworkAsList(json['relatedCourses']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseItem.fromJson(map);
      })())
            .whereType<CourseItem>()
            .toList();
      })(),
      sections: (() {
        final list = _sdkworkAsList(json['sections']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseSectionItem.fromJson(map);
      })())
            .whereType<CourseSectionItem>()
            .toList();
      })(),
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        return map == null ? null : CourseOverviewSource.fromJson(map);
      })(),
      studentsCount: json['studentsCount'] is int ? json['studentsCount'] : null,
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      thumbnailUrl: json['thumbnailUrl']?.toString(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'categoryLabel': categoryLabel,
      'commentCount': commentCount,
      'content': content,
      'contentId': contentId,
      'courseCode': courseCode,
      'currency': currency,
      'description': description,
      'durationText': durationText,
      'engagement': engagement?.toJson(),
      'externalBvid': externalBvid,
      'id': id,
      'instructor': instructor?.toJson(),
      'isCollection': isCollection,
      'lessonsCount': lessonsCount,
      'level': level,
      'levelLabel': levelLabel,
      'priceAmount': priceAmount,
      'publishedAt': publishedAt,
      'ratingScore': ratingScore,
      'relatedCourses': relatedCourses?.map((item) => item.toJson()).toList(),
      'sections': sections?.map((item) => item.toJson()).toList(),
      'source': source?.toJson(),
      'studentsCount': studentsCount,
      'tags': tags?.map((item) => item).toList(),
      'thumbnailUrl': thumbnailUrl,
      'title': title,
    };
  }
}

class CourseEngagement {
  final int? discussions;
  final int? likes;
  final int? saves;
  final int? shares;
  final int? studentsCount;
  final int? views;

  CourseEngagement({
    this.discussions,
    this.likes,
    this.saves,
    this.shares,
    this.studentsCount,
    this.views
  });

  factory CourseEngagement.fromJson(Map<String, dynamic> json) {
    return CourseEngagement(
      discussions: json['discussions'] is int ? json['discussions'] : null,
      likes: json['likes'] is int ? json['likes'] : null,
      saves: json['saves'] is int ? json['saves'] : null,
      shares: json['shares'] is int ? json['shares'] : null,
      studentsCount: json['studentsCount'] is int ? json['studentsCount'] : null,
      views: json['views'] is int ? json['views'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'discussions': discussions,
      'likes': likes,
      'saves': saves,
      'shares': shares,
      'studentsCount': studentsCount,
      'views': views,
    };
  }
}

class CourseInstructor {
  final String? avatar;
  final String? bio;
  final String? name;
  final String? title;

  CourseInstructor({
    this.avatar,
    this.bio,
    this.name,
    this.title
  });

  factory CourseInstructor.fromJson(Map<String, dynamic> json) {
    return CourseInstructor(
      avatar: json['avatar']?.toString(),
      bio: json['bio']?.toString(),
      name: json['name']?.toString(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'avatar': avatar,
      'bio': bio,
      'name': name,
      'title': title,
    };
  }
}

class CourseItem {
  final String? category;
  final String? categoryLabel;
  final int? commentCount;
  final String? content;
  final int? contentId;
  final String? courseCode;
  final String? currency;
  final String? description;
  final String? durationText;
  final CourseEngagement? engagement;
  final String? externalBvid;
  final String? id;
  final CourseInstructor? instructor;
  final bool? isCollection;
  final int? lessonsCount;
  final int? level;
  final String? levelLabel;
  final String? priceAmount;
  final String? publishedAt;
  final double? ratingScore;
  final int? studentsCount;
  final List<String>? tags;
  final String? thumbnailUrl;
  final String? title;

  CourseItem({
    this.category,
    this.categoryLabel,
    this.commentCount,
    this.content,
    this.contentId,
    this.courseCode,
    this.currency,
    this.description,
    this.durationText,
    this.engagement,
    this.externalBvid,
    this.id,
    this.instructor,
    this.isCollection,
    this.lessonsCount,
    this.level,
    this.levelLabel,
    this.priceAmount,
    this.publishedAt,
    this.ratingScore,
    this.studentsCount,
    this.tags,
    this.thumbnailUrl,
    this.title
  });

  factory CourseItem.fromJson(Map<String, dynamic> json) {
    return CourseItem(
      category: json['category']?.toString(),
      categoryLabel: json['categoryLabel']?.toString(),
      commentCount: json['commentCount'] is int ? json['commentCount'] : null,
      content: json['content']?.toString(),
      contentId: json['contentId'] is int ? json['contentId'] : null,
      courseCode: json['courseCode']?.toString(),
      currency: json['currency']?.toString(),
      description: json['description']?.toString(),
      durationText: json['durationText']?.toString(),
      engagement: (() {
        final map = _sdkworkAsMap(json['engagement']);
        return map == null ? null : CourseEngagement.fromJson(map);
      })(),
      externalBvid: json['externalBvid']?.toString(),
      id: json['id']?.toString(),
      instructor: (() {
        final map = _sdkworkAsMap(json['instructor']);
        return map == null ? null : CourseInstructor.fromJson(map);
      })(),
      isCollection: json['isCollection'] is bool ? json['isCollection'] : null,
      lessonsCount: json['lessonsCount'] is int ? json['lessonsCount'] : null,
      level: json['level'] is int ? json['level'] : null,
      levelLabel: json['levelLabel']?.toString(),
      priceAmount: json['priceAmount']?.toString(),
      publishedAt: json['publishedAt']?.toString(),
      ratingScore: json['ratingScore'] is num ? json['ratingScore'].toDouble() : null,
      studentsCount: json['studentsCount'] is int ? json['studentsCount'] : null,
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      thumbnailUrl: json['thumbnailUrl']?.toString(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'categoryLabel': categoryLabel,
      'commentCount': commentCount,
      'content': content,
      'contentId': contentId,
      'courseCode': courseCode,
      'currency': currency,
      'description': description,
      'durationText': durationText,
      'engagement': engagement?.toJson(),
      'externalBvid': externalBvid,
      'id': id,
      'instructor': instructor?.toJson(),
      'isCollection': isCollection,
      'lessonsCount': lessonsCount,
      'level': level,
      'levelLabel': levelLabel,
      'priceAmount': priceAmount,
      'publishedAt': publishedAt,
      'ratingScore': ratingScore,
      'studentsCount': studentsCount,
      'tags': tags?.map((item) => item).toList(),
      'thumbnailUrl': thumbnailUrl,
      'title': title,
    };
  }
}

class CourseLessonItem {
  final String? content;
  final String? description;
  final int? durationSeconds;
  final String? durationText;
  final String? externalBvid;
  final bool? freePreview;
  final String? id;
  final int? lessonId;
  final int? lessonNo;
  final int? number;
  final int? sortOrder;
  final String? sourceProvider;
  final String? title;
  final String? videoUrl;

  CourseLessonItem({
    this.content,
    this.description,
    this.durationSeconds,
    this.durationText,
    this.externalBvid,
    this.freePreview,
    this.id,
    this.lessonId,
    this.lessonNo,
    this.number,
    this.sortOrder,
    this.sourceProvider,
    this.title,
    this.videoUrl
  });

  factory CourseLessonItem.fromJson(Map<String, dynamic> json) {
    return CourseLessonItem(
      content: json['content']?.toString(),
      description: json['description']?.toString(),
      durationSeconds: json['durationSeconds'] is int ? json['durationSeconds'] : null,
      durationText: json['durationText']?.toString(),
      externalBvid: json['externalBvid']?.toString(),
      freePreview: json['freePreview'] is bool ? json['freePreview'] : null,
      id: json['id']?.toString(),
      lessonId: json['lessonId'] is int ? json['lessonId'] : null,
      lessonNo: json['lessonNo'] is int ? json['lessonNo'] : null,
      number: json['number'] is int ? json['number'] : null,
      sortOrder: json['sortOrder'] is int ? json['sortOrder'] : null,
      sourceProvider: json['sourceProvider']?.toString(),
      title: json['title']?.toString(),
      videoUrl: json['videoUrl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'description': description,
      'durationSeconds': durationSeconds,
      'durationText': durationText,
      'externalBvid': externalBvid,
      'freePreview': freePreview,
      'id': id,
      'lessonId': lessonId,
      'lessonNo': lessonNo,
      'number': number,
      'sortOrder': sortOrder,
      'sourceProvider': sourceProvider,
      'title': title,
      'videoUrl': videoUrl,
    };
  }
}

class CourseListResponse {
  final List<CourseItem>? content;
  final List<CourseItem>? items;
  final int? page;
  final int? size;
  final int? totalElements;

  CourseListResponse({
    this.content,
    this.items,
    this.page,
    this.size,
    this.totalElements
  });

  factory CourseListResponse.fromJson(Map<String, dynamic> json) {
    return CourseListResponse(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseItem.fromJson(map);
      })())
            .whereType<CourseItem>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseItem.fromJson(map);
      })())
            .whereType<CourseItem>()
            .toList();
      })(),
      page: json['page'] is int ? json['page'] : null,
      size: json['size'] is int ? json['size'] : null,
      totalElements: json['totalElements'] is int ? json['totalElements'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'items': items?.map((item) => item.toJson()).toList(),
      'page': page,
      'size': size,
      'totalElements': totalElements,
    };
  }
}

class CourseOverview {
  final CourseOverviewSource? source;
  final CourseOverviewStats? stats;

  CourseOverview({
    this.source,
    this.stats
  });

  factory CourseOverview.fromJson(Map<String, dynamic> json) {
    return CourseOverview(
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        return map == null ? null : CourseOverviewSource.fromJson(map);
      })(),
      stats: (() {
        final map = _sdkworkAsMap(json['stats']);
        return map == null ? null : CourseOverviewStats.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'source': source?.toJson(),
      'stats': stats?.toJson(),
    };
  }
}

class CourseOverviewSource {
  final String? observedAt;
  final String? sourceDescription;
  final String? sourceLabel;
  final List<String>? sourceTables;

  CourseOverviewSource({
    this.observedAt,
    this.sourceDescription,
    this.sourceLabel,
    this.sourceTables
  });

  factory CourseOverviewSource.fromJson(Map<String, dynamic> json) {
    return CourseOverviewSource(
      observedAt: json['observedAt']?.toString(),
      sourceDescription: json['sourceDescription']?.toString(),
      sourceLabel: json['sourceLabel']?.toString(),
      sourceTables: (() {
        final list = _sdkworkAsList(json['sourceTables']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'observedAt': observedAt,
      'sourceDescription': sourceDescription,
      'sourceLabel': sourceLabel,
      'sourceTables': sourceTables?.map((item) => item).toList(),
    };
  }
}

class CourseOverviewStats {
  final int? totalCategories;
  final int? totalCourses;
  final int? totalLessons;
  final int? totalStudents;

  CourseOverviewStats({
    this.totalCategories,
    this.totalCourses,
    this.totalLessons,
    this.totalStudents
  });

  factory CourseOverviewStats.fromJson(Map<String, dynamic> json) {
    return CourseOverviewStats(
      totalCategories: json['totalCategories'] is int ? json['totalCategories'] : null,
      totalCourses: json['totalCourses'] is int ? json['totalCourses'] : null,
      totalLessons: json['totalLessons'] is int ? json['totalLessons'] : null,
      totalStudents: json['totalStudents'] is int ? json['totalStudents'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'totalCategories': totalCategories,
      'totalCourses': totalCourses,
      'totalLessons': totalLessons,
      'totalStudents': totalStudents,
    };
  }
}

class CourseSectionItem {
  final String? description;
  final int? durationSeconds;
  final String? id;
  final int? lessonCount;
  final List<CourseLessonItem>? lessons;
  final int? sectionId;
  final int? sectionNo;
  final int? sortOrder;
  final String? title;

  CourseSectionItem({
    this.description,
    this.durationSeconds,
    this.id,
    this.lessonCount,
    this.lessons,
    this.sectionId,
    this.sectionNo,
    this.sortOrder,
    this.title
  });

  factory CourseSectionItem.fromJson(Map<String, dynamic> json) {
    return CourseSectionItem(
      description: json['description']?.toString(),
      durationSeconds: json['durationSeconds'] is int ? json['durationSeconds'] : null,
      id: json['id']?.toString(),
      lessonCount: json['lessonCount'] is int ? json['lessonCount'] : null,
      lessons: (() {
        final list = _sdkworkAsList(json['lessons']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseLessonItem.fromJson(map);
      })())
            .whereType<CourseLessonItem>()
            .toList();
      })(),
      sectionId: json['sectionId'] is int ? json['sectionId'] : null,
      sectionNo: json['sectionNo'] is int ? json['sectionNo'] : null,
      sortOrder: json['sortOrder'] is int ? json['sortOrder'] : null,
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'durationSeconds': durationSeconds,
      'id': id,
      'lessonCount': lessonCount,
      'lessons': lessons?.map((item) => item.toJson()).toList(),
      'sectionId': sectionId,
      'sectionNo': sectionNo,
      'sortOrder': sortOrder,
      'title': title,
    };
  }
}

class CoursesCategoriesListResult {
  final String? code;
  final List<CourseCategoryItem>? data;
  final String? message;
  final String? msg;

  CoursesCategoriesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CoursesCategoriesListResult.fromJson(Map<String, dynamic> json) {
    return CoursesCategoriesListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CourseCategoryItem.fromJson(map);
      })())
            .whereType<CourseCategoryItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class CoursesListResult {
  final String? code;
  final CourseListResponse? data;
  final String? message;
  final String? msg;

  CoursesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CoursesListResult.fromJson(Map<String, dynamic> json) {
    return CoursesListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseListResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CoursesOverviewRetrieveResult {
  final String? code;
  final CourseOverview? data;
  final String? message;
  final String? msg;

  CoursesOverviewRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CoursesOverviewRetrieveResult.fromJson(Map<String, dynamic> json) {
    return CoursesOverviewRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseOverview.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CoursesRetrieveResult {
  final String? code;
  final CourseDetail? data;
  final String? message;
  final String? msg;

  CoursesRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory CoursesRetrieveResult.fromJson(Map<String, dynamic> json) {
    return CoursesRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CourseDetail.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class CreateApiKeyRequest {
  final String? expires;
  final String? group;
  final String? ipLimit;
  final bool? isUnlimitedQuota;
  final List<String>? modalities;
  final String? name;
  final String? quota;

  CreateApiKeyRequest({
    this.expires,
    this.group,
    this.ipLimit,
    this.isUnlimitedQuota,
    this.modalities,
    this.name,
    this.quota
  });

  factory CreateApiKeyRequest.fromJson(Map<String, dynamic> json) {
    return CreateApiKeyRequest(
      expires: json['expires']?.toString(),
      group: json['group']?.toString(),
      ipLimit: json['ipLimit']?.toString(),
      isUnlimitedQuota: json['isUnlimitedQuota'] is bool ? json['isUnlimitedQuota'] : null,
      modalities: (() {
        final list = _sdkworkAsList(json['modalities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: json['name']?.toString(),
      quota: json['quota']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'expires': expires,
      'group': group,
      'ipLimit': ipLimit,
      'isUnlimitedQuota': isUnlimitedQuota,
      'modalities': modalities?.map((item) => item).toList(),
      'name': name,
      'quota': quota,
    };
  }
}

class CreateApiKeyResponse {
  final AppApiKeyItem? item;
  final String? rawKey;

  CreateApiKeyResponse({
    this.item,
    this.rawKey
  });

  factory CreateApiKeyResponse.fromJson(Map<String, dynamic> json) {
    return CreateApiKeyResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        return map == null ? null : AppApiKeyItem.fromJson(map);
      })(),
      rawKey: json['rawKey']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item?.toJson(),
      'rawKey': rawKey,
    };
  }
}

class CreateRoutingChannelRequest {
  final String? accessType;
  final String? baseUrl;
  final List<String>? capabilities;
  final List<String>? models;
  final String? name;
  final String? protocol;
  final String? secretRef;
  final String? status;
  final String? vendor;
  final int? weight;

  CreateRoutingChannelRequest({
    this.accessType,
    this.baseUrl,
    this.capabilities,
    this.models,
    this.name,
    this.protocol,
    this.secretRef,
    this.status,
    this.vendor,
    this.weight
  });

  factory CreateRoutingChannelRequest.fromJson(Map<String, dynamic> json) {
    return CreateRoutingChannelRequest(
      accessType: json['accessType']?.toString(),
      baseUrl: json['baseUrl']?.toString(),
      capabilities: (() {
        final list = _sdkworkAsList(json['capabilities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      models: (() {
        final list = _sdkworkAsList(json['models']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: json['name']?.toString(),
      protocol: json['protocol']?.toString(),
      secretRef: json['secretRef']?.toString(),
      status: json['status']?.toString(),
      vendor: json['vendor']?.toString(),
      weight: json['weight'] is int ? json['weight'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accessType': accessType,
      'baseUrl': baseUrl,
      'capabilities': capabilities?.map((item) => item).toList(),
      'models': models?.map((item) => item).toList(),
      'name': name,
      'protocol': protocol,
      'secretRef': secretRef,
      'status': status,
      'vendor': vendor,
      'weight': weight,
    };
  }
}

class DashboardAnnouncement {
  final int? id;
  final String? text;
  final String? time;
  final String? type;

  DashboardAnnouncement({
    this.id,
    this.text,
    this.time,
    this.type
  });

  factory DashboardAnnouncement.fromJson(Map<String, dynamic> json) {
    return DashboardAnnouncement(
      id: json['id'] is int ? json['id'] : null,
      text: json['text']?.toString(),
      time: json['time']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'text': text,
      'time': time,
      'type': type,
    };
  }
}

class DashboardChartPoint {
  final double? audioWhisper;
  final double? imageMidjourneyDallE;
  final double? llmText;
  final double? musicSuno;
  final String? time;
  final double? videoRunwaySora;

  DashboardChartPoint({
    this.audioWhisper,
    this.imageMidjourneyDallE,
    this.llmText,
    this.musicSuno,
    this.time,
    this.videoRunwaySora
  });

  factory DashboardChartPoint.fromJson(Map<String, dynamic> json) {
    return DashboardChartPoint(
      audioWhisper: json['audio (Whisper)'] is num ? json['audio (Whisper)'].toDouble() : null,
      imageMidjourneyDallE: json['image (Midjourney/DALL-E)'] is num ? json['image (Midjourney/DALL-E)'].toDouble() : null,
      llmText: json['llm (Text)'] is num ? json['llm (Text)'].toDouble() : null,
      musicSuno: json['music (Suno)'] is num ? json['music (Suno)'].toDouble() : null,
      time: json['time']?.toString(),
      videoRunwaySora: json['video (Runway/Sora)'] is num ? json['video (Runway/Sora)'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio (Whisper)': audioWhisper,
      'image (Midjourney/DALL-E)': imageMidjourneyDallE,
      'llm (Text)': llmText,
      'music (Suno)': musicSuno,
      'time': time,
      'video (Runway/Sora)': videoRunwaySora,
    };
  }
}

class DashboardOverviewResponse {
  final List<DashboardAnnouncement>? announcements;
  final List<DashboardChartPoint>? chartData;
  final List<DashboardSparklinePoint>? multimodalSparkline;
  final List<DashboardSparklinePoint>? performanceSparkline;
  final List<DashboardSparklinePoint>? requestSparkline;
  final DashboardOverviewSummary? summary;
  final List<DashboardTopModel>? topModels;
  final List<String>? warnings;

  DashboardOverviewResponse({
    this.announcements,
    this.chartData,
    this.multimodalSparkline,
    this.performanceSparkline,
    this.requestSparkline,
    this.summary,
    this.topModels,
    this.warnings
  });

  factory DashboardOverviewResponse.fromJson(Map<String, dynamic> json) {
    return DashboardOverviewResponse(
      announcements: (() {
        final list = _sdkworkAsList(json['announcements']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardAnnouncement.fromJson(map);
      })())
            .whereType<DashboardAnnouncement>()
            .toList();
      })(),
      chartData: (() {
        final list = _sdkworkAsList(json['chartData']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardChartPoint.fromJson(map);
      })())
            .whereType<DashboardChartPoint>()
            .toList();
      })(),
      multimodalSparkline: (() {
        final list = _sdkworkAsList(json['multimodalSparkline']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardSparklinePoint.fromJson(map);
      })())
            .whereType<DashboardSparklinePoint>()
            .toList();
      })(),
      performanceSparkline: (() {
        final list = _sdkworkAsList(json['performanceSparkline']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardSparklinePoint.fromJson(map);
      })())
            .whereType<DashboardSparklinePoint>()
            .toList();
      })(),
      requestSparkline: (() {
        final list = _sdkworkAsList(json['requestSparkline']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardSparklinePoint.fromJson(map);
      })())
            .whereType<DashboardSparklinePoint>()
            .toList();
      })(),
      summary: (() {
        final map = _sdkworkAsMap(json['summary']);
        return map == null ? null : DashboardOverviewSummary.fromJson(map);
      })(),
      topModels: (() {
        final list = _sdkworkAsList(json['topModels']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : DashboardTopModel.fromJson(map);
      })())
            .whereType<DashboardTopModel>()
            .toList();
      })(),
      warnings: (() {
        final list = _sdkworkAsList(json['warnings']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'announcements': announcements?.map((item) => item.toJson()).toList(),
      'chartData': chartData?.map((item) => item.toJson()).toList(),
      'multimodalSparkline': multimodalSparkline?.map((item) => item.toJson()).toList(),
      'performanceSparkline': performanceSparkline?.map((item) => item.toJson()).toList(),
      'requestSparkline': requestSparkline?.map((item) => item.toJson()).toList(),
      'summary': summary?.toJson(),
      'topModels': topModels?.map((item) => item.toJson()).toList(),
      'warnings': warnings?.map((item) => item).toList(),
    };
  }
}

class DashboardOverviewRetrieveResult {
  final String? code;
  final DashboardOverviewResponse? data;
  final String? message;
  final String? msg;

  DashboardOverviewRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory DashboardOverviewRetrieveResult.fromJson(Map<String, dynamic> json) {
    return DashboardOverviewRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : DashboardOverviewResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class DashboardOverviewSummary {
  final int? audioRequests;
  final double? availableCredits;
  final int? errorCount;
  final int? imageRequests;
  final int? musicRequests;
  final int? requestCount;
  final double? rpm;
  final double? tpm;
  final double? usedCredits;
  final int? videoRequests;

  DashboardOverviewSummary({
    this.audioRequests,
    this.availableCredits,
    this.errorCount,
    this.imageRequests,
    this.musicRequests,
    this.requestCount,
    this.rpm,
    this.tpm,
    this.usedCredits,
    this.videoRequests
  });

  factory DashboardOverviewSummary.fromJson(Map<String, dynamic> json) {
    return DashboardOverviewSummary(
      audioRequests: json['audioRequests'] is int ? json['audioRequests'] : null,
      availableCredits: json['availableCredits'] is num ? json['availableCredits'].toDouble() : null,
      errorCount: json['errorCount'] is int ? json['errorCount'] : null,
      imageRequests: json['imageRequests'] is int ? json['imageRequests'] : null,
      musicRequests: json['musicRequests'] is int ? json['musicRequests'] : null,
      requestCount: json['requestCount'] is int ? json['requestCount'] : null,
      rpm: json['rpm'] is num ? json['rpm'].toDouble() : null,
      tpm: json['tpm'] is num ? json['tpm'].toDouble() : null,
      usedCredits: json['usedCredits'] is num ? json['usedCredits'].toDouble() : null,
      videoRequests: json['videoRequests'] is int ? json['videoRequests'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audioRequests': audioRequests,
      'availableCredits': availableCredits,
      'errorCount': errorCount,
      'imageRequests': imageRequests,
      'musicRequests': musicRequests,
      'requestCount': requestCount,
      'rpm': rpm,
      'tpm': tpm,
      'usedCredits': usedCredits,
      'videoRequests': videoRequests,
    };
  }
}

class DashboardSparklinePoint {
  final double? value;

  DashboardSparklinePoint({
    this.value
  });

  factory DashboardSparklinePoint.fromJson(Map<String, dynamic> json) {
    return DashboardSparklinePoint(
      value: json['value'] is num ? json['value'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'value': value,
    };
  }
}

class DashboardTopModel {
  final double? cost;
  final bool? isUp;
  final String? modality;
  final String? name;
  final int? rank;
  final int? requests;
  final String? supplier;
  final String? trend;

  DashboardTopModel({
    this.cost,
    this.isUp,
    this.modality,
    this.name,
    this.rank,
    this.requests,
    this.supplier,
    this.trend
  });

  factory DashboardTopModel.fromJson(Map<String, dynamic> json) {
    return DashboardTopModel(
      cost: json['cost'] is num ? json['cost'].toDouble() : null,
      isUp: json['isUp'] is bool ? json['isUp'] : null,
      modality: json['modality']?.toString(),
      name: json['name']?.toString(),
      rank: json['rank'] is int ? json['rank'] : null,
      requests: json['requests'] is int ? json['requests'] : null,
      supplier: json['supplier']?.toString(),
      trend: json['trend']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cost': cost,
      'isUp': isUp,
      'modality': modality,
      'name': name,
      'rank': rank,
      'requests': requests,
      'supplier': supplier,
      'trend': trend,
    };
  }
}

class FeedsCategoryRetrieveResult {
  final String? code;
  final List<ForumFeedItem>? data;
  final String? message;
  final String? msg;

  FeedsCategoryRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsCategoryRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsCategoryRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsCollectionsCreateResult {
  final String? code;
  final ForumFeedItem? data;
  final String? message;
  final String? msg;

  FeedsCollectionsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsCollectionsCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsCollectionsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsCollectionsCurrentDeleteResult {
  final String? code;
  final ForumFeedItem? data;
  final String? message;
  final String? msg;

  FeedsCollectionsCurrentDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsCollectionsCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return FeedsCollectionsCurrentDeleteResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsCollectionsCurrentRetrieveResult {
  final String? code;
  final bool? data;
  final String? message;
  final String? msg;

  FeedsCollectionsCurrentRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsCollectionsCurrentRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsCollectionsCurrentRetrieveResult(
      code: json['code']?.toString(),
      data: json['data'] is bool ? json['data'] : null,
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data,
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsCreateResult {
  final String? code;
  final ForumFeedItem? data;
  final String? message;
  final String? msg;

  FeedsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsDeleteResult {
  final String? code;
  final bool? data;
  final String? message;
  final String? msg;

  FeedsDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsDeleteResult.fromJson(Map<String, dynamic> json) {
    return FeedsDeleteResult(
      code: json['code']?.toString(),
      data: json['data'] is bool ? json['data'] : null,
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data,
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsHotListResult {
  final String? code;
  final List<ForumFeedItem>? data;
  final String? message;
  final String? msg;

  FeedsHotListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsHotListResult.fromJson(Map<String, dynamic> json) {
    return FeedsHotListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsLikesCreateResult {
  final String? code;
  final ForumFeedItem? data;
  final String? message;
  final String? msg;

  FeedsLikesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsLikesCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsLikesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsLikesCurrentDeleteResult {
  final String? code;
  final ForumFeedItem? data;
  final String? message;
  final String? msg;

  FeedsLikesCurrentDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsLikesCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return FeedsLikesCurrentDeleteResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsListResult {
  final String? code;
  final List<ForumFeedItem>? data;
  final String? message;
  final String? msg;

  FeedsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsListResult.fromJson(Map<String, dynamic> json) {
    return FeedsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsMostLikedListResult {
  final String? code;
  final List<ForumFeedItem>? data;
  final String? message;
  final String? msg;

  FeedsMostLikedListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsMostLikedListResult.fromJson(Map<String, dynamic> json) {
    return FeedsMostLikedListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsMostViewedListResult {
  final String? code;
  final List<ForumFeedItem>? data;
  final String? message;
  final String? msg;

  FeedsMostViewedListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsMostViewedListResult.fromJson(Map<String, dynamic> json) {
    return FeedsMostViewedListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsOverviewRetrieveResult {
  final String? code;
  final ForumOverviewResponse? data;
  final String? message;
  final String? msg;

  FeedsOverviewRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsOverviewRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsOverviewRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumOverviewResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsRecommendListResult {
  final String? code;
  final List<ForumFeedItem>? data;
  final String? message;
  final String? msg;

  FeedsRecommendListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsRecommendListResult.fromJson(Map<String, dynamic> json) {
    return FeedsRecommendListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsRetrieveResult {
  final String? code;
  final ForumFeedItem? data;
  final String? message;
  final String? msg;

  FeedsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return FeedsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsSharesCreateResult {
  final String? code;
  final ForumFeedItem? data;
  final String? message;
  final String? msg;

  FeedsSharesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsSharesCreateResult.fromJson(Map<String, dynamic> json) {
    return FeedsSharesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class FeedsTopListResult {
  final String? code;
  final List<ForumFeedItem>? data;
  final String? message;
  final String? msg;

  FeedsTopListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory FeedsTopListResult.fromJson(Map<String, dynamic> json) {
    return FeedsTopListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumFeedItem.fromJson(map);
      })())
            .whereType<ForumFeedItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class FieldError {
  final String? code;
  final String? field;
  final String? message;

  FieldError({
    this.code,
    this.field,
    this.message
  });

  factory FieldError.fromJson(Map<String, dynamic> json) {
    return FieldError(
      code: json['code']?.toString(),
      field: json['field']?.toString(),
      message: json['message']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'field': field,
      'message': message,
    };
  }
}

class ForumAuthor {
  final String? avatar;
  final String? bio;
  final int? id;
  final bool? isFollowing;
  final String? name;

  ForumAuthor({
    this.avatar,
    this.bio,
    this.id,
    this.isFollowing,
    this.name
  });

  factory ForumAuthor.fromJson(Map<String, dynamic> json) {
    return ForumAuthor(
      avatar: json['avatar']?.toString(),
      bio: json['bio']?.toString(),
      id: json['id'] is int ? json['id'] : null,
      isFollowing: json['isFollowing'] is bool ? json['isFollowing'] : null,
      name: json['name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'avatar': avatar,
      'bio': bio,
      'id': id,
      'isFollowing': isFollowing,
      'name': name,
    };
  }
}

class ForumCommentDetail {
  final ForumAuthor? author;
  final String? commentId;
  final String? content;
  final int? contentId;
  final String? contentType;
  final String? createdAt;
  final String? deviceInfo;
  final String? ipAddress;
  final bool? isTop;
  final int? likes;
  final int? parentId;
  final List<ForumCommentItem>? replies;
  final int? replyCount;
  final String? status;
  final String? updatedAt;
  final int? userId;

  ForumCommentDetail({
    this.author,
    this.commentId,
    this.content,
    this.contentId,
    this.contentType,
    this.createdAt,
    this.deviceInfo,
    this.ipAddress,
    this.isTop,
    this.likes,
    this.parentId,
    this.replies,
    this.replyCount,
    this.status,
    this.updatedAt,
    this.userId
  });

  factory ForumCommentDetail.fromJson(Map<String, dynamic> json) {
    return ForumCommentDetail(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        return map == null ? null : ForumAuthor.fromJson(map);
      })(),
      commentId: json['commentId']?.toString(),
      content: json['content']?.toString(),
      contentId: json['contentId'] is int ? json['contentId'] : null,
      contentType: json['contentType']?.toString(),
      createdAt: json['createdAt']?.toString(),
      deviceInfo: json['deviceInfo']?.toString(),
      ipAddress: json['ipAddress']?.toString(),
      isTop: json['isTop'] is bool ? json['isTop'] : null,
      likes: json['likes'] is int ? json['likes'] : null,
      parentId: json['parentId'] is int ? json['parentId'] : null,
      replies: (() {
        final list = _sdkworkAsList(json['replies']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })())
            .whereType<ForumCommentItem>()
            .toList();
      })(),
      replyCount: json['replyCount'] is int ? json['replyCount'] : null,
      status: json['status']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      userId: json['userId'] is int ? json['userId'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author?.toJson(),
      'commentId': commentId,
      'content': content,
      'contentId': contentId,
      'contentType': contentType,
      'createdAt': createdAt,
      'deviceInfo': deviceInfo,
      'ipAddress': ipAddress,
      'isTop': isTop,
      'likes': likes,
      'parentId': parentId,
      'replies': replies?.map((item) => item.toJson()).toList(),
      'replyCount': replyCount,
      'status': status,
      'updatedAt': updatedAt,
      'userId': userId,
    };
  }
}

class ForumCommentItem {
  final ForumAuthor? author;
  final String? commentId;
  final String? content;
  final int? contentId;
  final String? contentType;
  final String? createdAt;
  final bool? isTop;
  final int? likes;
  final int? parentId;
  final int? replyCount;
  final String? status;
  final int? userId;

  ForumCommentItem({
    this.author,
    this.commentId,
    this.content,
    this.contentId,
    this.contentType,
    this.createdAt,
    this.isTop,
    this.likes,
    this.parentId,
    this.replyCount,
    this.status,
    this.userId
  });

  factory ForumCommentItem.fromJson(Map<String, dynamic> json) {
    return ForumCommentItem(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        return map == null ? null : ForumAuthor.fromJson(map);
      })(),
      commentId: json['commentId']?.toString(),
      content: json['content']?.toString(),
      contentId: json['contentId'] is int ? json['contentId'] : null,
      contentType: json['contentType']?.toString(),
      createdAt: json['createdAt']?.toString(),
      isTop: json['isTop'] is bool ? json['isTop'] : null,
      likes: json['likes'] is int ? json['likes'] : null,
      parentId: json['parentId'] is int ? json['parentId'] : null,
      replyCount: json['replyCount'] is int ? json['replyCount'] : null,
      status: json['status']?.toString(),
      userId: json['userId'] is int ? json['userId'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author?.toJson(),
      'commentId': commentId,
      'content': content,
      'contentId': contentId,
      'contentType': contentType,
      'createdAt': createdAt,
      'isTop': isTop,
      'likes': likes,
      'parentId': parentId,
      'replyCount': replyCount,
      'status': status,
      'userId': userId,
    };
  }
}

class ForumCommentPage {
  final List<ForumCommentItem>? content;
  final List<ForumCommentItem>? items;
  final int? page;
  final int? size;
  final int? totalElements;

  ForumCommentPage({
    this.content,
    this.items,
    this.page,
    this.size,
    this.totalElements
  });

  factory ForumCommentPage.fromJson(Map<String, dynamic> json) {
    return ForumCommentPage(
      content: (() {
        final list = _sdkworkAsList(json['content']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })())
            .whereType<ForumCommentItem>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommentItem.fromJson(map);
      })())
            .whereType<ForumCommentItem>()
            .toList();
      })(),
      page: json['page'] is int ? json['page'] : null,
      size: json['size'] is int ? json['size'] : null,
      totalElements: json['totalElements'] is int ? json['totalElements'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content?.map((item) => item.toJson()).toList(),
      'items': items?.map((item) => item.toJson()).toList(),
      'page': page,
      'size': size,
      'totalElements': totalElements,
    };
  }
}

class ForumCommentStatistics {
  final int? totalComments;

  ForumCommentStatistics({
    this.totalComments
  });

  factory ForumCommentStatistics.fromJson(Map<String, dynamic> json) {
    return ForumCommentStatistics(
      totalComments: json['totalComments'] is int ? json['totalComments'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'totalComments': totalComments,
    };
  }
}

class ForumCommunityLink {
  final String? id;
  final String? label;
  final String? qrCodeUrl;
  final String? tone;
  final String? url;

  ForumCommunityLink({
    this.id,
    this.label,
    this.qrCodeUrl,
    this.tone,
    this.url
  });

  factory ForumCommunityLink.fromJson(Map<String, dynamic> json) {
    return ForumCommunityLink(
      id: json['id']?.toString(),
      label: json['label']?.toString(),
      qrCodeUrl: json['qrCodeUrl']?.toString(),
      tone: json['tone']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'label': label,
      'qrCodeUrl': qrCodeUrl,
      'tone': tone,
      'url': url,
    };
  }
}

class ForumCreateCommentRequest {
  final String? content;
  final int? contentId;
  final String? contentType;
  final String? deviceInfo;

  ForumCreateCommentRequest({
    this.content,
    this.contentId,
    this.contentType,
    this.deviceInfo
  });

  factory ForumCreateCommentRequest.fromJson(Map<String, dynamic> json) {
    return ForumCreateCommentRequest(
      content: json['content']?.toString(),
      contentId: json['contentId'] is int ? json['contentId'] : null,
      contentType: json['contentType']?.toString(),
      deviceInfo: json['deviceInfo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'contentId': contentId,
      'contentType': contentType,
      'deviceInfo': deviceInfo,
    };
  }
}

class ForumCreateFeedRequest {
  final int? categoryId;
  final String? content;
  final List<String>? images;
  final String? source;
  final String? sourceUrl;
  final List<String>? tags;
  final String? title;

  ForumCreateFeedRequest({
    this.categoryId,
    this.content,
    this.images,
    this.source,
    this.sourceUrl,
    this.tags,
    this.title
  });

  factory ForumCreateFeedRequest.fromJson(Map<String, dynamic> json) {
    return ForumCreateFeedRequest(
      categoryId: json['categoryId'] is int ? json['categoryId'] : null,
      content: json['content']?.toString(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      source: json['source']?.toString(),
      sourceUrl: json['sourceUrl']?.toString(),
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      title: json['title']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'categoryId': categoryId,
      'content': content,
      'images': images?.map((item) => item).toList(),
      'source': source,
      'sourceUrl': sourceUrl,
      'tags': tags?.map((item) => item).toList(),
      'title': title,
    };
  }
}

class ForumFeedItem {
  final ForumAuthor? author;
  final int? categoryId;
  final int? commentCount;
  final String? content;
  final String? contentType;
  final String? coverImage;
  final String? createdAt;
  final int? id;
  final bool? isCollected;
  final bool? isHot;
  final bool? isLiked;
  final bool? isRecommended;
  final bool? isTop;
  final int? likeCount;
  final int? shareCount;
  final String? summary;
  final List<String>? tags;
  final String? title;
  final String? updatedAt;
  final int? viewCount;

  ForumFeedItem({
    this.author,
    this.categoryId,
    this.commentCount,
    this.content,
    this.contentType,
    this.coverImage,
    this.createdAt,
    this.id,
    this.isCollected,
    this.isHot,
    this.isLiked,
    this.isRecommended,
    this.isTop,
    this.likeCount,
    this.shareCount,
    this.summary,
    this.tags,
    this.title,
    this.updatedAt,
    this.viewCount
  });

  factory ForumFeedItem.fromJson(Map<String, dynamic> json) {
    return ForumFeedItem(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        return map == null ? null : ForumAuthor.fromJson(map);
      })(),
      categoryId: json['categoryId'] is int ? json['categoryId'] : null,
      commentCount: json['commentCount'] is int ? json['commentCount'] : null,
      content: json['content']?.toString(),
      contentType: json['contentType']?.toString(),
      coverImage: json['coverImage']?.toString(),
      createdAt: json['createdAt']?.toString(),
      id: json['id'] is int ? json['id'] : null,
      isCollected: json['isCollected'] is bool ? json['isCollected'] : null,
      isHot: json['isHot'] is bool ? json['isHot'] : null,
      isLiked: json['isLiked'] is bool ? json['isLiked'] : null,
      isRecommended: json['isRecommended'] is bool ? json['isRecommended'] : null,
      isTop: json['isTop'] is bool ? json['isTop'] : null,
      likeCount: json['likeCount'] is int ? json['likeCount'] : null,
      shareCount: json['shareCount'] is int ? json['shareCount'] : null,
      summary: json['summary']?.toString(),
      tags: (() {
        final list = _sdkworkAsList(json['tags']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      title: json['title']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      viewCount: json['viewCount'] is int ? json['viewCount'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author?.toJson(),
      'categoryId': categoryId,
      'commentCount': commentCount,
      'content': content,
      'contentType': contentType,
      'coverImage': coverImage,
      'createdAt': createdAt,
      'id': id,
      'isCollected': isCollected,
      'isHot': isHot,
      'isLiked': isLiked,
      'isRecommended': isRecommended,
      'isTop': isTop,
      'likeCount': likeCount,
      'shareCount': shareCount,
      'summary': summary,
      'tags': tags?.map((item) => item).toList(),
      'title': title,
      'updatedAt': updatedAt,
      'viewCount': viewCount,
    };
  }
}

class ForumOverviewResponse {
  final List<ForumCommunityLink>? communityLinks;
  final ForumOverviewSource? source;
  final ForumOverviewStats? stats;

  ForumOverviewResponse({
    this.communityLinks,
    this.source,
    this.stats
  });

  factory ForumOverviewResponse.fromJson(Map<String, dynamic> json) {
    return ForumOverviewResponse(
      communityLinks: (() {
        final list = _sdkworkAsList(json['communityLinks']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ForumCommunityLink.fromJson(map);
      })())
            .whereType<ForumCommunityLink>()
            .toList();
      })(),
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        return map == null ? null : ForumOverviewSource.fromJson(map);
      })(),
      stats: (() {
        final map = _sdkworkAsMap(json['stats']);
        return map == null ? null : ForumOverviewStats.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'communityLinks': communityLinks?.map((item) => item.toJson()).toList(),
      'source': source?.toJson(),
      'stats': stats?.toJson(),
    };
  }
}

class ForumOverviewSource {
  final String? observedAt;
  final String? sourceDescription;
  final String? sourceLabel;
  final List<String>? sourceTables;

  ForumOverviewSource({
    this.observedAt,
    this.sourceDescription,
    this.sourceLabel,
    this.sourceTables
  });

  factory ForumOverviewSource.fromJson(Map<String, dynamic> json) {
    return ForumOverviewSource(
      observedAt: json['observedAt']?.toString(),
      sourceDescription: json['sourceDescription']?.toString(),
      sourceLabel: json['sourceLabel']?.toString(),
      sourceTables: (() {
        final list = _sdkworkAsList(json['sourceTables']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'observedAt': observedAt,
      'sourceDescription': sourceDescription,
      'sourceLabel': sourceLabel,
      'sourceTables': sourceTables?.map((item) => item).toList(),
    };
  }
}

class ForumOverviewStats {
  final int? memberCount;
  final int? onlineMembers;
  final int? totalComments;
  final int? totalPosts;

  ForumOverviewStats({
    this.memberCount,
    this.onlineMembers,
    this.totalComments,
    this.totalPosts
  });

  factory ForumOverviewStats.fromJson(Map<String, dynamic> json) {
    return ForumOverviewStats(
      memberCount: json['memberCount'] is int ? json['memberCount'] : null,
      onlineMembers: json['onlineMembers'] is int ? json['onlineMembers'] : null,
      totalComments: json['totalComments'] is int ? json['totalComments'] : null,
      totalPosts: json['totalPosts'] is int ? json['totalPosts'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'memberCount': memberCount,
      'onlineMembers': onlineMembers,
      'totalComments': totalComments,
      'totalPosts': totalPosts,
    };
  }
}

class ForumReplyCommentRequest {
  final String? content;
  final String? deviceInfo;

  ForumReplyCommentRequest({
    this.content,
    this.deviceInfo
  });

  factory ForumReplyCommentRequest.fromJson(Map<String, dynamic> json) {
    return ForumReplyCommentRequest(
      content: json['content']?.toString(),
      deviceInfo: json['deviceInfo']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'deviceInfo': deviceInfo,
    };
  }
}

class GatewayTrace {
  final String? channel;
  final String? duration;
  final String? endpoint;
  final String? id;
  final String? ip;
  final String? method;
  final int? status;
  final String? time;

  GatewayTrace({
    this.channel,
    this.duration,
    this.endpoint,
    this.id,
    this.ip,
    this.method,
    this.status,
    this.time
  });

  factory GatewayTrace.fromJson(Map<String, dynamic> json) {
    return GatewayTrace(
      channel: json['channel']?.toString(),
      duration: json['duration']?.toString(),
      endpoint: json['endpoint']?.toString(),
      id: json['id']?.toString(),
      ip: json['ip']?.toString(),
      method: json['method']?.toString(),
      status: json['status'] is int ? json['status'] : null,
      time: json['time']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channel': channel,
      'duration': duration,
      'endpoint': endpoint,
      'id': id,
      'ip': ip,
      'method': method,
      'status': status,
      'time': time,
    };
  }
}

class GatewayTracesListResult {
  final String? code;
  final GatewayTracesResponse? data;
  final String? message;
  final String? msg;

  GatewayTracesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory GatewayTracesListResult.fromJson(Map<String, dynamic> json) {
    return GatewayTracesListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : GatewayTracesResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class GatewayTracesResponse {
  final List<GatewayTrace>? items;

  GatewayTracesResponse({
    this.items
  });

  factory GatewayTracesResponse.fromJson(Map<String, dynamic> json) {
    return GatewayTracesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GatewayTrace.fromJson(map);
      })())
            .whereType<GatewayTrace>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class GenerationHistoryItem {
  final String? createdAt;
  final String? date;
  final String? id;
  final List<String>? images;
  final String? modelInfo;
  final String? prompt;
  final String? status;
  final String? type;
  final String? updatedAt;
  final String? url;
  final List<GenerationHistoryMediaItem>? videos;

  GenerationHistoryItem({
    this.createdAt,
    this.date,
    this.id,
    this.images,
    this.modelInfo,
    this.prompt,
    this.status,
    this.type,
    this.updatedAt,
    this.url,
    this.videos
  });

  factory GenerationHistoryItem.fromJson(Map<String, dynamic> json) {
    return GenerationHistoryItem(
      createdAt: json['createdAt']?.toString(),
      date: json['date']?.toString(),
      id: json['id']?.toString(),
      images: (() {
        final list = _sdkworkAsList(json['images']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      modelInfo: json['modelInfo']?.toString(),
      prompt: json['prompt']?.toString(),
      status: json['status']?.toString(),
      type: json['type']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      url: json['url']?.toString(),
      videos: (() {
        final list = _sdkworkAsList(json['videos']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GenerationHistoryMediaItem.fromJson(map);
      })())
            .whereType<GenerationHistoryMediaItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'createdAt': createdAt,
      'date': date,
      'id': id,
      'images': images?.map((item) => item).toList(),
      'modelInfo': modelInfo,
      'prompt': prompt,
      'status': status,
      'type': type,
      'updatedAt': updatedAt,
      'url': url,
      'videos': videos?.map((item) => item.toJson()).toList(),
    };
  }
}

class GenerationHistoryMediaItem {
  final String? thumb;
  final String? url;

  GenerationHistoryMediaItem({
    this.thumb,
    this.url
  });

  factory GenerationHistoryMediaItem.fromJson(Map<String, dynamic> json) {
    return GenerationHistoryMediaItem(
      thumb: json['thumb']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'thumb': thumb,
      'url': url,
    };
  }
}

class GenerationHistoryResponse {
  final List<GenerationHistoryItem>? items;

  GenerationHistoryResponse({
    this.items
  });

  factory GenerationHistoryResponse.fromJson(Map<String, dynamic> json) {
    return GenerationHistoryResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : GenerationHistoryItem.fromJson(map);
      })())
            .whereType<GenerationHistoryItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class GenerationsListResult {
  final String? code;
  final GenerationHistoryResponse? data;
  final String? message;
  final String? msg;

  GenerationsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory GenerationsListResult.fromJson(Map<String, dynamic> json) {
    return GenerationsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : GenerationHistoryResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class IamAppContext {
  final String? appId;
  final String? authLevel;
  final List<String>? dataScope;
  final String? deploymentMode;
  final String? environment;
  final String? organizationId;
  final List<String>? permissionScope;
  final String? sessionId;
  final String? tenantId;
  final String? userId;

  IamAppContext({
    this.appId,
    this.authLevel,
    this.dataScope,
    this.deploymentMode,
    this.environment,
    this.organizationId,
    this.permissionScope,
    this.sessionId,
    this.tenantId,
    this.userId
  });

  factory IamAppContext.fromJson(Map<String, dynamic> json) {
    return IamAppContext(
      appId: json['appId']?.toString(),
      authLevel: json['authLevel']?.toString(),
      dataScope: (() {
        final list = _sdkworkAsList(json['dataScope']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      deploymentMode: json['deploymentMode']?.toString(),
      environment: json['environment']?.toString(),
      organizationId: json['organizationId']?.toString(),
      permissionScope: (() {
        final list = _sdkworkAsList(json['permissionScope']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      sessionId: json['sessionId']?.toString(),
      tenantId: json['tenantId']?.toString(),
      userId: json['userId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'appId': appId,
      'authLevel': authLevel,
      'dataScope': dataScope?.map((item) => item).toList(),
      'deploymentMode': deploymentMode,
      'environment': environment,
      'organizationId': organizationId,
      'permissionScope': permissionScope?.map((item) => item).toList(),
      'sessionId': sessionId,
      'tenantId': tenantId,
      'userId': userId,
    };
  }
}

class IamAuditEventRecord {
  final String? action;
  final String? actorUserId;
  final String? appId;
  final String? createdAt;
  final Map<String, dynamic>? detailJson;
  final String? environment;
  final String? id;
  final String? organizationId;
  final String? requestId;
  final String? resourceId;
  final String? resourceType;
  final String? shardingKey;
  final String? tenantId;

  IamAuditEventRecord({
    this.action,
    this.actorUserId,
    this.appId,
    this.createdAt,
    this.detailJson,
    this.environment,
    this.id,
    this.organizationId,
    this.requestId,
    this.resourceId,
    this.resourceType,
    this.shardingKey,
    this.tenantId
  });

  factory IamAuditEventRecord.fromJson(Map<String, dynamic> json) {
    return IamAuditEventRecord(
      action: json['action']?.toString(),
      actorUserId: json['actor_user_id']?.toString(),
      appId: json['app_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      detailJson: (() {
        final map = _sdkworkAsMap(json['detail_json']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      environment: json['environment']?.toString(),
      id: json['id']?.toString(),
      organizationId: json['organization_id']?.toString(),
      requestId: json['request_id']?.toString(),
      resourceId: json['resource_id']?.toString(),
      resourceType: json['resource_type']?.toString(),
      shardingKey: json['sharding_key']?.toString(),
      tenantId: json['tenant_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'action': action,
      'actor_user_id': actorUserId,
      'app_id': appId,
      'created_at': createdAt,
      'detail_json': detailJson?.map((key, item) => MapEntry(key, item)),
      'environment': environment,
      'id': id,
      'organization_id': organizationId,
      'request_id': requestId,
      'resource_id': resourceId,
      'resource_type': resourceType,
      'sharding_key': shardingKey,
      'tenant_id': tenantId,
    };
  }
}

class IamCredentialRecord {
  final String? createdAt;
  final String? credentialHash;
  final String? credentialType;
  final String? expiresAt;
  final String? id;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? userId;

  IamCredentialRecord({
    this.createdAt,
    this.credentialHash,
    this.credentialType,
    this.expiresAt,
    this.id,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.userId
  });

  factory IamCredentialRecord.fromJson(Map<String, dynamic> json) {
    return IamCredentialRecord(
      createdAt: json['created_at']?.toString(),
      credentialHash: json['credential_hash']?.toString(),
      credentialType: json['credential_type']?.toString(),
      expiresAt: json['expires_at']?.toString(),
      id: json['id']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'credential_hash': credentialHash,
      'credential_type': credentialType,
      'expires_at': expiresAt,
      'id': id,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'user_id': userId,
    };
  }
}

class IamCurrentSessionUpdateRequest {
  final String? deviceName;
  final String? organizationCode;
  final String? organizationId;

  IamCurrentSessionUpdateRequest({
    this.deviceName,
    this.organizationCode,
    this.organizationId
  });

  factory IamCurrentSessionUpdateRequest.fromJson(Map<String, dynamic> json) {
    return IamCurrentSessionUpdateRequest(
      deviceName: json['deviceName']?.toString(),
      organizationCode: json['organizationCode']?.toString(),
      organizationId: json['organizationId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'deviceName': deviceName,
      'organizationCode': organizationCode,
      'organizationId': organizationId,
    };
  }
}

class IamGatewayAccessPolicyRecord {
  final Map<String, dynamic>? allowedCapabilities;
  final Map<String, dynamic>? allowedModels;
  final String? createdAt;
  final String? dataRetentionMode;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final Map<String, dynamic>? deniedCapabilities;
  final Map<String, dynamic>? deniedModels;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? id;
  final Map<String, dynamic>? ipAllowlist;
  final Map<String, dynamic>? ipDenylist;
  final int? ipRuleCount;
  final String? maxContextTokens;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? networkPolicyMode;
  final String? organizationId;
  final String? policyType;
  final Map<String, dynamic>? regionAllowlist;
  final String? status;
  final String? subjectId;
  final String? subjectRefHash;
  final String? subjectRefMasked;
  final String? subjectType;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  IamGatewayAccessPolicyRecord({
    this.allowedCapabilities,
    this.allowedModels,
    this.createdAt,
    this.dataRetentionMode,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.deniedCapabilities,
    this.deniedModels,
    this.effectiveFrom,
    this.effectiveTo,
    this.id,
    this.ipAllowlist,
    this.ipDenylist,
    this.ipRuleCount,
    this.maxContextTokens,
    this.metadata,
    this.name,
    this.networkPolicyMode,
    this.organizationId,
    this.policyType,
    this.regionAllowlist,
    this.status,
    this.subjectId,
    this.subjectRefHash,
    this.subjectRefMasked,
    this.subjectType,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory IamGatewayAccessPolicyRecord.fromJson(Map<String, dynamic> json) {
    return IamGatewayAccessPolicyRecord(
      allowedCapabilities: (() {
        final map = _sdkworkAsMap(json['allowed_capabilities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      allowedModels: (() {
        final map = _sdkworkAsMap(json['allowed_models']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      createdAt: json['created_at']?.toString(),
      dataRetentionMode: json['data_retention_mode']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      deniedCapabilities: (() {
        final map = _sdkworkAsMap(json['denied_capabilities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      deniedModels: (() {
        final map = _sdkworkAsMap(json['denied_models']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      id: json['id']?.toString(),
      ipAllowlist: (() {
        final map = _sdkworkAsMap(json['ip_allowlist']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      ipDenylist: (() {
        final map = _sdkworkAsMap(json['ip_denylist']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      ipRuleCount: json['ip_rule_count'] is int ? json['ip_rule_count'] : null,
      maxContextTokens: json['max_context_tokens']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      name: json['name']?.toString(),
      networkPolicyMode: json['network_policy_mode']?.toString(),
      organizationId: json['organization_id']?.toString(),
      policyType: json['policy_type']?.toString(),
      regionAllowlist: (() {
        final map = _sdkworkAsMap(json['region_allowlist']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      status: json['status']?.toString(),
      subjectId: json['subject_id']?.toString(),
      subjectRefHash: json['subject_ref_hash']?.toString(),
      subjectRefMasked: json['subject_ref_masked']?.toString(),
      subjectType: json['subject_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'allowed_capabilities': allowedCapabilities?.map((key, item) => MapEntry(key, item)),
      'allowed_models': allowedModels?.map((key, item) => MapEntry(key, item)),
      'created_at': createdAt,
      'data_retention_mode': dataRetentionMode,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'denied_capabilities': deniedCapabilities?.map((key, item) => MapEntry(key, item)),
      'denied_models': deniedModels?.map((key, item) => MapEntry(key, item)),
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'id': id,
      'ip_allowlist': ipAllowlist?.map((key, item) => MapEntry(key, item)),
      'ip_denylist': ipDenylist?.map((key, item) => MapEntry(key, item)),
      'ip_rule_count': ipRuleCount,
      'max_context_tokens': maxContextTokens,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'network_policy_mode': networkPolicyMode,
      'organization_id': organizationId,
      'policy_type': policyType,
      'region_allowlist': regionAllowlist?.map((key, item) => MapEntry(key, item)),
      'status': status,
      'subject_id': subjectId,
      'subject_ref_hash': subjectRefHash,
      'subject_ref_masked': subjectRefMasked,
      'subject_type': subjectType,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IamGatewayApiKeyGroupMetricSnapshotRecord {
  final String? accountAvailableCount;
  final String? accountTotalCount;
  final String? capacityLimit;
  final String? capacityUsed;
  final String? createdAt;
  final String? groupCode;
  final String? groupId;
  final String? healthStatus;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? providerCode;
  final String? rebuildVersion;
  final String? requestCountToday;
  final String? requestCountTotal;
  final String? snapshotAt;
  final String? sourceId;
  final String? sourceType;
  final String? sourceVersion;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? usageAmountToday;
  final String? usageAmountTotal;
  final String? uuid;

  IamGatewayApiKeyGroupMetricSnapshotRecord({
    this.accountAvailableCount,
    this.accountTotalCount,
    this.capacityLimit,
    this.capacityUsed,
    this.createdAt,
    this.groupCode,
    this.groupId,
    this.healthStatus,
    this.id,
    this.metadata,
    this.organizationId,
    this.providerCode,
    this.rebuildVersion,
    this.requestCountToday,
    this.requestCountTotal,
    this.snapshotAt,
    this.sourceId,
    this.sourceType,
    this.sourceVersion,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.usageAmountToday,
    this.usageAmountTotal,
    this.uuid
  });

  factory IamGatewayApiKeyGroupMetricSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return IamGatewayApiKeyGroupMetricSnapshotRecord(
      accountAvailableCount: json['account_available_count']?.toString(),
      accountTotalCount: json['account_total_count']?.toString(),
      capacityLimit: json['capacity_limit']?.toString(),
      capacityUsed: json['capacity_used']?.toString(),
      createdAt: json['created_at']?.toString(),
      groupCode: json['group_code']?.toString(),
      groupId: json['group_id']?.toString(),
      healthStatus: json['health_status']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      providerCode: json['provider_code']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      requestCountToday: json['request_count_today']?.toString(),
      requestCountTotal: json['request_count_total']?.toString(),
      snapshotAt: json['snapshot_at']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      usageAmountToday: json['usage_amount_today']?.toString(),
      usageAmountTotal: json['usage_amount_total']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'account_available_count': accountAvailableCount,
      'account_total_count': accountTotalCount,
      'capacity_limit': capacityLimit,
      'capacity_used': capacityUsed,
      'created_at': createdAt,
      'group_code': groupCode,
      'group_id': groupId,
      'health_status': healthStatus,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'provider_code': providerCode,
      'rebuild_version': rebuildVersion,
      'request_count_today': requestCountToday,
      'request_count_total': requestCountTotal,
      'snapshot_at': snapshotAt,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'usage_amount_today': usageAmountToday,
      'usage_amount_total': usageAmountTotal,
      'uuid': uuid,
    };
  }
}

class IamGatewayApiKeyGroupRecord {
  final Map<String, dynamic>? allowedOrigin;
  final String? billingType;
  final String? capacityLimit;
  final String? code;
  final String? createdAt;
  final String? dataScope;
  final String? defaultPolicyId;
  final String? defaultQuotaPolicyId;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? environment;
  final String? groupType;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? officialPriceMultiplier;
  final String? organizationId;
  final String? priceReferenceMode;
  final String? pricingPlanCode;
  final String? pricingPlanId;
  final String? providerCode;
  final String? rateMultiplier;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  IamGatewayApiKeyGroupRecord({
    this.allowedOrigin,
    this.billingType,
    this.capacityLimit,
    this.code,
    this.createdAt,
    this.dataScope,
    this.defaultPolicyId,
    this.defaultQuotaPolicyId,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.environment,
    this.groupType,
    this.id,
    this.metadata,
    this.name,
    this.officialPriceMultiplier,
    this.organizationId,
    this.priceReferenceMode,
    this.pricingPlanCode,
    this.pricingPlanId,
    this.providerCode,
    this.rateMultiplier,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory IamGatewayApiKeyGroupRecord.fromJson(Map<String, dynamic> json) {
    return IamGatewayApiKeyGroupRecord(
      allowedOrigin: (() {
        final map = _sdkworkAsMap(json['allowed_origin']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      billingType: json['billing_type']?.toString(),
      capacityLimit: json['capacity_limit']?.toString(),
      code: json['code']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultPolicyId: json['default_policy_id']?.toString(),
      defaultQuotaPolicyId: json['default_quota_policy_id']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      environment: json['environment']?.toString(),
      groupType: json['group_type']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      name: json['name']?.toString(),
      officialPriceMultiplier: json['official_price_multiplier']?.toString(),
      organizationId: json['organization_id']?.toString(),
      priceReferenceMode: json['price_reference_mode']?.toString(),
      pricingPlanCode: json['pricing_plan_code']?.toString(),
      pricingPlanId: json['pricing_plan_id']?.toString(),
      providerCode: json['provider_code']?.toString(),
      rateMultiplier: json['rate_multiplier']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'allowed_origin': allowedOrigin?.map((key, item) => MapEntry(key, item)),
      'billing_type': billingType,
      'capacity_limit': capacityLimit,
      'code': code,
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_policy_id': defaultPolicyId,
      'default_quota_policy_id': defaultQuotaPolicyId,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'environment': environment,
      'group_type': groupType,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'official_price_multiplier': officialPriceMultiplier,
      'organization_id': organizationId,
      'price_reference_mode': priceReferenceMode,
      'pricing_plan_code': pricingPlanCode,
      'pricing_plan_id': pricingPlanId,
      'provider_code': providerCode,
      'rate_multiplier': rateMultiplier,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IamGatewayApiKeyRecord {
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? environment;
  final String? expireAt;
  final String? groupId;
  final String? hashAlg;
  final String? id;
  final String? idempotencyKey;
  final String? keyDisplayMasked;
  final String? keyHash;
  final String? keyPrefix;
  final String? lastRevealedAt;
  final String? lastUsedAt;
  final String? lastUsedIpHash;
  final String? lastUsedIpMasked;
  final String? lastUsedIpRegion;
  final String? legacyApiKeyId;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final String? policyId;
  final String? quotaPolicyId;
  final String? rateLimitPolicyId;
  final String? revokedAt;
  final String? revokedBy;
  final String? rotatedFromKeyId;
  final String? secretVersion;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;

  IamGatewayApiKeyRecord({
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.environment,
    this.expireAt,
    this.groupId,
    this.hashAlg,
    this.id,
    this.idempotencyKey,
    this.keyDisplayMasked,
    this.keyHash,
    this.keyPrefix,
    this.lastRevealedAt,
    this.lastUsedAt,
    this.lastUsedIpHash,
    this.lastUsedIpMasked,
    this.lastUsedIpRegion,
    this.legacyApiKeyId,
    this.metadata,
    this.name,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.policyId,
    this.quotaPolicyId,
    this.rateLimitPolicyId,
    this.revokedAt,
    this.revokedBy,
    this.rotatedFromKeyId,
    this.secretVersion,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version
  });

  factory IamGatewayApiKeyRecord.fromJson(Map<String, dynamic> json) {
    return IamGatewayApiKeyRecord(
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      environment: json['environment']?.toString(),
      expireAt: json['expire_at']?.toString(),
      groupId: json['group_id']?.toString(),
      hashAlg: json['hash_alg']?.toString(),
      id: json['id']?.toString(),
      idempotencyKey: json['idempotency_key']?.toString(),
      keyDisplayMasked: json['key_display_masked']?.toString(),
      keyHash: json['key_hash']?.toString(),
      keyPrefix: json['key_prefix']?.toString(),
      lastRevealedAt: json['last_revealed_at']?.toString(),
      lastUsedAt: json['last_used_at']?.toString(),
      lastUsedIpHash: json['last_used_ip_hash']?.toString(),
      lastUsedIpMasked: json['last_used_ip_masked']?.toString(),
      lastUsedIpRegion: json['last_used_ip_region']?.toString(),
      legacyApiKeyId: json['legacy_api_key_id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      name: json['name']?.toString(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      policyId: json['policy_id']?.toString(),
      quotaPolicyId: json['quota_policy_id']?.toString(),
      rateLimitPolicyId: json['rate_limit_policy_id']?.toString(),
      revokedAt: json['revoked_at']?.toString(),
      revokedBy: json['revoked_by']?.toString(),
      rotatedFromKeyId: json['rotated_from_key_id']?.toString(),
      secretVersion: json['secret_version']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'environment': environment,
      'expire_at': expireAt,
      'group_id': groupId,
      'hash_alg': hashAlg,
      'id': id,
      'idempotency_key': idempotencyKey,
      'key_display_masked': keyDisplayMasked,
      'key_hash': keyHash,
      'key_prefix': keyPrefix,
      'last_revealed_at': lastRevealedAt,
      'last_used_at': lastUsedAt,
      'last_used_ip_hash': lastUsedIpHash,
      'last_used_ip_masked': lastUsedIpMasked,
      'last_used_ip_region': lastUsedIpRegion,
      'legacy_api_key_id': legacyApiKeyId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'policy_id': policyId,
      'quota_policy_id': quotaPolicyId,
      'rate_limit_policy_id': rateLimitPolicyId,
      'revoked_at': revokedAt,
      'revoked_by': revokedBy,
      'rotated_from_key_id': rotatedFromKeyId,
      'secret_version': secretVersion,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IamGatewayRiskRuleRecord {
  final String? action;
  final String? blockDurationSeconds;
  final String? burstLimit;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? hitCount;
  final String? id;
  final String? lastHitAt;
  final String? matchMode;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final int? priority;
  final String? reason;
  final String? requestsPerDay;
  final String? requestsPerMinute;
  final String? requestsPerSecond;
  final String? ruleCategory;
  final String? ruleName;
  final String? ruleType;
  final String? scopeId;
  final String? scopeType;
  final String? status;
  final String? targetType;
  final String? targetValue;
  final String? targetValueCipherRef;
  final String? targetValueHash;
  final String? targetValueMasked;
  final String? tenantId;
  final String? tokensPerMinute;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  IamGatewayRiskRuleRecord({
    this.action,
    this.blockDurationSeconds,
    this.burstLimit,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.hitCount,
    this.id,
    this.lastHitAt,
    this.matchMode,
    this.metadata,
    this.organizationId,
    this.priority,
    this.reason,
    this.requestsPerDay,
    this.requestsPerMinute,
    this.requestsPerSecond,
    this.ruleCategory,
    this.ruleName,
    this.ruleType,
    this.scopeId,
    this.scopeType,
    this.status,
    this.targetType,
    this.targetValue,
    this.targetValueCipherRef,
    this.targetValueHash,
    this.targetValueMasked,
    this.tenantId,
    this.tokensPerMinute,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory IamGatewayRiskRuleRecord.fromJson(Map<String, dynamic> json) {
    return IamGatewayRiskRuleRecord(
      action: json['action']?.toString(),
      blockDurationSeconds: json['block_duration_seconds']?.toString(),
      burstLimit: json['burst_limit']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      hitCount: json['hit_count']?.toString(),
      id: json['id']?.toString(),
      lastHitAt: json['last_hit_at']?.toString(),
      matchMode: json['match_mode']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      priority: json['priority'] is int ? json['priority'] : null,
      reason: json['reason']?.toString(),
      requestsPerDay: json['requests_per_day']?.toString(),
      requestsPerMinute: json['requests_per_minute']?.toString(),
      requestsPerSecond: json['requests_per_second']?.toString(),
      ruleCategory: json['rule_category']?.toString(),
      ruleName: json['rule_name']?.toString(),
      ruleType: json['rule_type']?.toString(),
      scopeId: json['scope_id']?.toString(),
      scopeType: json['scope_type']?.toString(),
      status: json['status']?.toString(),
      targetType: json['target_type']?.toString(),
      targetValue: json['target_value']?.toString(),
      targetValueCipherRef: json['target_value_cipher_ref']?.toString(),
      targetValueHash: json['target_value_hash']?.toString(),
      targetValueMasked: json['target_value_masked']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      tokensPerMinute: json['tokens_per_minute']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'action': action,
      'block_duration_seconds': blockDurationSeconds,
      'burst_limit': burstLimit,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'hit_count': hitCount,
      'id': id,
      'last_hit_at': lastHitAt,
      'match_mode': matchMode,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'priority': priority,
      'reason': reason,
      'requests_per_day': requestsPerDay,
      'requests_per_minute': requestsPerMinute,
      'requests_per_second': requestsPerSecond,
      'rule_category': ruleCategory,
      'rule_name': ruleName,
      'rule_type': ruleType,
      'scope_id': scopeId,
      'scope_type': scopeType,
      'status': status,
      'target_type': targetType,
      'target_value': targetValue,
      'target_value_cipher_ref': targetValueCipherRef,
      'target_value_hash': targetValueHash,
      'target_value_masked': targetValueMasked,
      'tenant_id': tenantId,
      'tokens_per_minute': tokensPerMinute,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IamLoginQrCodeResponse {
  final String? description;
  final int? expireTime;
  final String? qrContent;
  final String? qrKey;
  final String? qrUrl;
  final String? title;
  final String? type;

  IamLoginQrCodeResponse({
    this.description,
    this.expireTime,
    this.qrContent,
    this.qrKey,
    this.qrUrl,
    this.title,
    this.type
  });

  factory IamLoginQrCodeResponse.fromJson(Map<String, dynamic> json) {
    return IamLoginQrCodeResponse(
      description: json['description']?.toString(),
      expireTime: json['expireTime'] is int ? json['expireTime'] : null,
      qrContent: json['qrContent']?.toString(),
      qrKey: json['qrKey']?.toString(),
      qrUrl: json['qrUrl']?.toString(),
      title: json['title']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'expireTime': expireTime,
      'qrContent': qrContent,
      'qrKey': qrKey,
      'qrUrl': qrUrl,
      'title': title,
      'type': type,
    };
  }
}

class IamLoginQrCodeStatusResponse {
  final IamSessionResponse? session;
  final String? status;
  final IamSessionResponse? token;
  final IamUserResponse? userInfo;

  IamLoginQrCodeStatusResponse({
    this.session,
    this.status,
    this.token,
    this.userInfo
  });

  factory IamLoginQrCodeStatusResponse.fromJson(Map<String, dynamic> json) {
    return IamLoginQrCodeStatusResponse(
      session: (() {
        final map = _sdkworkAsMap(json['session']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      status: json['status']?.toString(),
      token: (() {
        final map = _sdkworkAsMap(json['token']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      userInfo: (() {
        final map = _sdkworkAsMap(json['userInfo']);
        return map == null ? null : IamUserResponse.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'session': session?.toJson(),
      'status': status,
      'token': token?.toJson(),
      'userInfo': userInfo?.toJson(),
    };
  }
}

class IamOauthAuthorizationUrlResponse {
  final String? authUrl;

  IamOauthAuthorizationUrlResponse({
    this.authUrl
  });

  factory IamOauthAuthorizationUrlResponse.fromJson(Map<String, dynamic> json) {
    return IamOauthAuthorizationUrlResponse(
      authUrl: json['authUrl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'authUrl': authUrl,
    };
  }
}

class IamOauthSessionCreateRequest {
  final String? code;
  final String? deviceId;
  final String? deviceType;
  final String? provider;
  final String? state;

  IamOauthSessionCreateRequest({
    this.code,
    this.deviceId,
    this.deviceType,
    this.provider,
    this.state
  });

  factory IamOauthSessionCreateRequest.fromJson(Map<String, dynamic> json) {
    return IamOauthSessionCreateRequest(
      code: json['code']?.toString(),
      deviceId: json['deviceId']?.toString(),
      deviceType: json['deviceType']?.toString(),
      provider: json['provider']?.toString(),
      state: json['state']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'deviceId': deviceId,
      'deviceType': deviceType,
      'provider': provider,
      'state': state,
    };
  }
}

class IamOrganizationMemberRecord {
  final String? id;
  final String? joinedAt;
  final String? organizationId;
  final String? roleCode;
  final String? status;
  final String? tenantId;
  final String? userId;

  IamOrganizationMemberRecord({
    this.id,
    this.joinedAt,
    this.organizationId,
    this.roleCode,
    this.status,
    this.tenantId,
    this.userId
  });

  factory IamOrganizationMemberRecord.fromJson(Map<String, dynamic> json) {
    return IamOrganizationMemberRecord(
      id: json['id']?.toString(),
      joinedAt: json['joined_at']?.toString(),
      organizationId: json['organization_id']?.toString(),
      roleCode: json['role_code']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'joined_at': joinedAt,
      'organization_id': organizationId,
      'role_code': roleCode,
      'status': status,
      'tenant_id': tenantId,
      'user_id': userId,
    };
  }
}

class IamOrganizationRecord {
  final String? code;
  final String? createdAt;
  final String? id;
  final String? name;
  final String? parentId;
  final String? path;
  final String? status;
  final String? tenantId;
  final String? updatedAt;

  IamOrganizationRecord({
    this.code,
    this.createdAt,
    this.id,
    this.name,
    this.parentId,
    this.path,
    this.status,
    this.tenantId,
    this.updatedAt
  });

  factory IamOrganizationRecord.fromJson(Map<String, dynamic> json) {
    return IamOrganizationRecord(
      code: json['code']?.toString(),
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      parentId: json['parent_id']?.toString(),
      path: json['path']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'created_at': createdAt,
      'id': id,
      'name': name,
      'parent_id': parentId,
      'path': path,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
    };
  }
}

class IamPasswordResetCreateRequest {
  final String? account;
  final String? code;
  final String? confirmPassword;
  final String? newPassword;

  IamPasswordResetCreateRequest({
    this.account,
    this.code,
    this.confirmPassword,
    this.newPassword
  });

  factory IamPasswordResetCreateRequest.fromJson(Map<String, dynamic> json) {
    return IamPasswordResetCreateRequest(
      account: json['account']?.toString(),
      code: json['code']?.toString(),
      confirmPassword: json['confirmPassword']?.toString(),
      newPassword: json['newPassword']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'account': account,
      'code': code,
      'confirmPassword': confirmPassword,
      'newPassword': newPassword,
    };
  }
}

class IamPasswordResetRequestCreateRequest {
  final String? account;
  final String? channel;

  IamPasswordResetRequestCreateRequest({
    this.account,
    this.channel
  });

  factory IamPasswordResetRequestCreateRequest.fromJson(Map<String, dynamic> json) {
    return IamPasswordResetRequestCreateRequest(
      account: json['account']?.toString(),
      channel: json['channel']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'account': account,
      'channel': channel,
    };
  }
}

class IamPasswordResetRequestResponse {
  final String? debugCode;
  final String? expiresAt;
  final String? requestId;

  IamPasswordResetRequestResponse({
    this.debugCode,
    this.expiresAt,
    this.requestId
  });

  factory IamPasswordResetRequestResponse.fromJson(Map<String, dynamic> json) {
    return IamPasswordResetRequestResponse(
      debugCode: json['debugCode']?.toString(),
      expiresAt: json['expiresAt']?.toString(),
      requestId: json['requestId']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'debugCode': debugCode,
      'expiresAt': expiresAt,
      'requestId': requestId,
    };
  }
}

class IamRegistrationCreateRequest {
  final String? channel;
  final String? confirmPassword;
  final String? email;
  final String? organizationCode;
  final String? password;
  final String? phone;
  final String? tenantCode;
  final String? username;
  final String? verificationCode;

  IamRegistrationCreateRequest({
    this.channel,
    this.confirmPassword,
    this.email,
    this.organizationCode,
    this.password,
    this.phone,
    this.tenantCode,
    this.username,
    this.verificationCode
  });

  factory IamRegistrationCreateRequest.fromJson(Map<String, dynamic> json) {
    return IamRegistrationCreateRequest(
      channel: json['channel']?.toString(),
      confirmPassword: json['confirmPassword']?.toString(),
      email: json['email']?.toString(),
      organizationCode: json['organizationCode']?.toString(),
      password: json['password']?.toString(),
      phone: json['phone']?.toString(),
      tenantCode: json['tenantCode']?.toString(),
      username: json['username']?.toString(),
      verificationCode: json['verificationCode']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channel': channel,
      'confirmPassword': confirmPassword,
      'email': email,
      'organizationCode': organizationCode,
      'password': password,
      'phone': phone,
      'tenantCode': tenantCode,
      'username': username,
      'verificationCode': verificationCode,
    };
  }
}

class IamSecurityEventRecord {
  final String? createdAt;
  final Map<String, dynamic>? detailJson;
  final String? eventType;
  final String? id;
  final String? sessionId;
  final String? severity;
  final String? tenantId;
  final String? userId;

  IamSecurityEventRecord({
    this.createdAt,
    this.detailJson,
    this.eventType,
    this.id,
    this.sessionId,
    this.severity,
    this.tenantId,
    this.userId
  });

  factory IamSecurityEventRecord.fromJson(Map<String, dynamic> json) {
    return IamSecurityEventRecord(
      createdAt: json['created_at']?.toString(),
      detailJson: (() {
        final map = _sdkworkAsMap(json['detail_json']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      eventType: json['event_type']?.toString(),
      id: json['id']?.toString(),
      sessionId: json['session_id']?.toString(),
      severity: json['severity']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'detail_json': detailJson?.map((key, item) => MapEntry(key, item)),
      'event_type': eventType,
      'id': id,
      'session_id': sessionId,
      'severity': severity,
      'tenant_id': tenantId,
      'user_id': userId,
    };
  }
}

class IamSessionCreateRequest {
  final String? code;
  final String? deviceId;
  final String? deviceName;
  final String? deviceType;
  final String? email;
  final String? grantType;
  final String? name;
  final String? organizationCode;
  final String? password;
  final String? phone;
  final String? subject;
  final String? tenantCode;
  final String? username;

  IamSessionCreateRequest({
    this.code,
    this.deviceId,
    this.deviceName,
    this.deviceType,
    this.email,
    this.grantType,
    this.name,
    this.organizationCode,
    this.password,
    this.phone,
    this.subject,
    this.tenantCode,
    this.username
  });

  factory IamSessionCreateRequest.fromJson(Map<String, dynamic> json) {
    return IamSessionCreateRequest(
      code: json['code']?.toString(),
      deviceId: json['deviceId']?.toString(),
      deviceName: json['deviceName']?.toString(),
      deviceType: json['deviceType']?.toString(),
      email: json['email']?.toString(),
      grantType: json['grantType']?.toString(),
      name: json['name']?.toString(),
      organizationCode: json['organizationCode']?.toString(),
      password: json['password']?.toString(),
      phone: json['phone']?.toString(),
      subject: json['subject']?.toString(),
      tenantCode: json['tenantCode']?.toString(),
      username: json['username']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'deviceId': deviceId,
      'deviceName': deviceName,
      'deviceType': deviceType,
      'email': email,
      'grantType': grantType,
      'name': name,
      'organizationCode': organizationCode,
      'password': password,
      'phone': phone,
      'subject': subject,
      'tenantCode': tenantCode,
      'username': username,
    };
  }
}

class IamSessionRecord {
  final String? accessTokenHash;
  final String? appId;
  final String? authLevel;
  final String? authTokenHash;
  final String? createdAt;
  final Map<String, dynamic>? dataScopeJson;
  final String? deploymentMode;
  final String? environment;
  final String? expiresAt;
  final String? id;
  final String? organizationId;
  final Map<String, dynamic>? permissionScopeJson;
  final String? refreshTokenHash;
  final String? revokedAt;
  final String? shardingKey;
  final String? shardingStrategy;
  final String? tenantId;
  final String? updatedAt;
  final String? userId;

  IamSessionRecord({
    this.accessTokenHash,
    this.appId,
    this.authLevel,
    this.authTokenHash,
    this.createdAt,
    this.dataScopeJson,
    this.deploymentMode,
    this.environment,
    this.expiresAt,
    this.id,
    this.organizationId,
    this.permissionScopeJson,
    this.refreshTokenHash,
    this.revokedAt,
    this.shardingKey,
    this.shardingStrategy,
    this.tenantId,
    this.updatedAt,
    this.userId
  });

  factory IamSessionRecord.fromJson(Map<String, dynamic> json) {
    return IamSessionRecord(
      accessTokenHash: json['access_token_hash']?.toString(),
      appId: json['app_id']?.toString(),
      authLevel: json['auth_level']?.toString(),
      authTokenHash: json['auth_token_hash']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScopeJson: (() {
        final map = _sdkworkAsMap(json['data_scope_json']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      deploymentMode: json['deployment_mode']?.toString(),
      environment: json['environment']?.toString(),
      expiresAt: json['expires_at']?.toString(),
      id: json['id']?.toString(),
      organizationId: json['organization_id']?.toString(),
      permissionScopeJson: (() {
        final map = _sdkworkAsMap(json['permission_scope_json']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      refreshTokenHash: json['refresh_token_hash']?.toString(),
      revokedAt: json['revoked_at']?.toString(),
      shardingKey: json['sharding_key']?.toString(),
      shardingStrategy: json['sharding_strategy']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'access_token_hash': accessTokenHash,
      'app_id': appId,
      'auth_level': authLevel,
      'auth_token_hash': authTokenHash,
      'created_at': createdAt,
      'data_scope_json': dataScopeJson?.map((key, item) => MapEntry(key, item)),
      'deployment_mode': deploymentMode,
      'environment': environment,
      'expires_at': expiresAt,
      'id': id,
      'organization_id': organizationId,
      'permission_scope_json': permissionScopeJson?.map((key, item) => MapEntry(key, item)),
      'refresh_token_hash': refreshTokenHash,
      'revoked_at': revokedAt,
      'sharding_key': shardingKey,
      'sharding_strategy': shardingStrategy,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'user_id': userId,
    };
  }
}

class IamSessionRefreshRequest {
  final String? refreshToken;

  IamSessionRefreshRequest({
    this.refreshToken
  });

  factory IamSessionRefreshRequest.fromJson(Map<String, dynamic> json) {
    return IamSessionRefreshRequest(
      refreshToken: json['refreshToken']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'refreshToken': refreshToken,
    };
  }
}

class IamSessionResponse {
  final String? accessToken;
  final String? authToken;
  final IamAppContext? context;
  final String? expiresAt;
  final String? refreshToken;
  final String? sessionId;
  final IamUserResponse? user;

  IamSessionResponse({
    this.accessToken,
    this.authToken,
    this.context,
    this.expiresAt,
    this.refreshToken,
    this.sessionId,
    this.user
  });

  factory IamSessionResponse.fromJson(Map<String, dynamic> json) {
    return IamSessionResponse(
      accessToken: json['accessToken']?.toString(),
      authToken: json['authToken']?.toString(),
      context: (() {
        final map = _sdkworkAsMap(json['context']);
        return map == null ? null : IamAppContext.fromJson(map);
      })(),
      expiresAt: json['expiresAt']?.toString(),
      refreshToken: json['refreshToken']?.toString(),
      sessionId: json['sessionId']?.toString(),
      user: (() {
        final map = _sdkworkAsMap(json['user']);
        return map == null ? null : IamUserResponse.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accessToken': accessToken,
      'authToken': authToken,
      'context': context?.toJson(),
      'expiresAt': expiresAt,
      'refreshToken': refreshToken,
      'sessionId': sessionId,
      'user': user?.toJson(),
    };
  }
}

class IamTenantRecord {
  final String? code;
  final String? createdAt;
  final String? id;
  final String? name;
  final String? status;
  final String? updatedAt;

  IamTenantRecord({
    this.code,
    this.createdAt,
    this.id,
    this.name,
    this.status,
    this.updatedAt
  });

  factory IamTenantRecord.fromJson(Map<String, dynamic> json) {
    return IamTenantRecord(
      code: json['code']?.toString(),
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      name: json['name']?.toString(),
      status: json['status']?.toString(),
      updatedAt: json['updated_at']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'created_at': createdAt,
      'id': id,
      'name': name,
      'status': status,
      'updated_at': updatedAt,
    };
  }
}

class IamUserIdentityRecord {
  final String? createdAt;
  final String? email;
  final String? id;
  final String? provider;
  final String? subject;
  final String? tenantId;
  final String? userId;

  IamUserIdentityRecord({
    this.createdAt,
    this.email,
    this.id,
    this.provider,
    this.subject,
    this.tenantId,
    this.userId
  });

  factory IamUserIdentityRecord.fromJson(Map<String, dynamic> json) {
    return IamUserIdentityRecord(
      createdAt: json['created_at']?.toString(),
      email: json['email']?.toString(),
      id: json['id']?.toString(),
      provider: json['provider']?.toString(),
      subject: json['subject']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'email': email,
      'id': id,
      'provider': provider,
      'subject': subject,
      'tenant_id': tenantId,
      'user_id': userId,
    };
  }
}

class IamUserLoginEventRecord {
  final String? authMethod;
  final String? authProvider;
  final String? clientIpHash;
  final String? clientIpMasked;
  final String? clientIpRegion;
  final String? createdAt;
  final String? deviceFingerprintHash;
  final String? deviceLabel;
  final String? failureReasonCode;
  final String? id;
  final bool? legalHold;
  final String? loginResult;
  final Map<String, dynamic>? metadata;
  final bool? mfaVerified;
  final String? occurredAt;
  final String? organizationId;
  final String? payloadHash;
  final String? requestId;
  final String? retentionUntil;
  final String? riskLevel;
  final String? sessionIdHash;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userAgentHash;
  final String? userId;
  final String? uuid;

  IamUserLoginEventRecord({
    this.authMethod,
    this.authProvider,
    this.clientIpHash,
    this.clientIpMasked,
    this.clientIpRegion,
    this.createdAt,
    this.deviceFingerprintHash,
    this.deviceLabel,
    this.failureReasonCode,
    this.id,
    this.legalHold,
    this.loginResult,
    this.metadata,
    this.mfaVerified,
    this.occurredAt,
    this.organizationId,
    this.payloadHash,
    this.requestId,
    this.retentionUntil,
    this.riskLevel,
    this.sessionIdHash,
    this.status,
    this.tenantId,
    this.traceId,
    this.userAgentHash,
    this.userId,
    this.uuid
  });

  factory IamUserLoginEventRecord.fromJson(Map<String, dynamic> json) {
    return IamUserLoginEventRecord(
      authMethod: json['auth_method']?.toString(),
      authProvider: json['auth_provider']?.toString(),
      clientIpHash: json['client_ip_hash']?.toString(),
      clientIpMasked: json['client_ip_masked']?.toString(),
      clientIpRegion: json['client_ip_region']?.toString(),
      createdAt: json['created_at']?.toString(),
      deviceFingerprintHash: json['device_fingerprint_hash']?.toString(),
      deviceLabel: json['device_label']?.toString(),
      failureReasonCode: json['failure_reason_code']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      loginResult: json['login_result']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      mfaVerified: json['mfa_verified'] is bool ? json['mfa_verified'] : null,
      occurredAt: json['occurred_at']?.toString(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      riskLevel: json['risk_level']?.toString(),
      sessionIdHash: json['session_id_hash']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userAgentHash: json['user_agent_hash']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'auth_method': authMethod,
      'auth_provider': authProvider,
      'client_ip_hash': clientIpHash,
      'client_ip_masked': clientIpMasked,
      'client_ip_region': clientIpRegion,
      'created_at': createdAt,
      'device_fingerprint_hash': deviceFingerprintHash,
      'device_label': deviceLabel,
      'failure_reason_code': failureReasonCode,
      'id': id,
      'legal_hold': legalHold,
      'login_result': loginResult,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mfa_verified': mfaVerified,
      'occurred_at': occurredAt,
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'risk_level': riskLevel,
      'session_id_hash': sessionIdHash,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_agent_hash': userAgentHash,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class IamUserPreferenceRecord {
  final Map<String, dynamic>? appearanceConfig;
  final String? createdAt;
  final String? dataScope;
  final String? defaultConsolePath;
  final String? deletedAt;
  final String? deletedBy;
  final String? id;
  final String? language;
  final Map<String, dynamic>? metadata;
  final Map<String, dynamic>? notificationPreferences;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final String? status;
  final String? tenantId;
  final String? themeMode;
  final String? timezone;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;

  IamUserPreferenceRecord({
    this.appearanceConfig,
    this.createdAt,
    this.dataScope,
    this.defaultConsolePath,
    this.deletedAt,
    this.deletedBy,
    this.id,
    this.language,
    this.metadata,
    this.notificationPreferences,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.status,
    this.tenantId,
    this.themeMode,
    this.timezone,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version
  });

  factory IamUserPreferenceRecord.fromJson(Map<String, dynamic> json) {
    return IamUserPreferenceRecord(
      appearanceConfig: (() {
        final map = _sdkworkAsMap(json['appearance_config']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultConsolePath: json['default_console_path']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      id: json['id']?.toString(),
      language: json['language']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      notificationPreferences: (() {
        final map = _sdkworkAsMap(json['notification_preferences']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      themeMode: json['theme_mode']?.toString(),
      timezone: json['timezone']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'appearance_config': appearanceConfig?.map((key, item) => MapEntry(key, item)),
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_console_path': defaultConsolePath,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'id': id,
      'language': language,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'notification_preferences': notificationPreferences?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'status': status,
      'tenant_id': tenantId,
      'theme_mode': themeMode,
      'timezone': timezone,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IamUserRecord {
  final String? avatarUrl;
  final String? createdAt;
  final String? displayName;
  final String? email;
  final String? id;
  final String? phone;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? username;

  IamUserRecord({
    this.avatarUrl,
    this.createdAt,
    this.displayName,
    this.email,
    this.id,
    this.phone,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.username
  });

  factory IamUserRecord.fromJson(Map<String, dynamic> json) {
    return IamUserRecord(
      avatarUrl: json['avatar_url']?.toString(),
      createdAt: json['created_at']?.toString(),
      displayName: json['display_name']?.toString(),
      email: json['email']?.toString(),
      id: json['id']?.toString(),
      phone: json['phone']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      username: json['username']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'avatar_url': avatarUrl,
      'created_at': createdAt,
      'display_name': displayName,
      'email': email,
      'id': id,
      'phone': phone,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'username': username,
    };
  }
}

class IamUserResponse {
  final String? avatarUrl;
  final String? displayName;
  final String? email;
  final String? id;
  final bool? isVerified;
  final String? language;
  final String? lastLogin;
  final String? lastLoginIp;
  final String? passwordLastChanged;
  final String? phone;
  final String? registeredAt;
  final String? status;
  final String? thirdPartyBound;
  final bool? twoFactorEnabled;
  final String? username;

  IamUserResponse({
    this.avatarUrl,
    this.displayName,
    this.email,
    this.id,
    this.isVerified,
    this.language,
    this.lastLogin,
    this.lastLoginIp,
    this.passwordLastChanged,
    this.phone,
    this.registeredAt,
    this.status,
    this.thirdPartyBound,
    this.twoFactorEnabled,
    this.username
  });

  factory IamUserResponse.fromJson(Map<String, dynamic> json) {
    return IamUserResponse(
      avatarUrl: json['avatarUrl']?.toString(),
      displayName: json['displayName']?.toString(),
      email: json['email']?.toString(),
      id: json['id']?.toString(),
      isVerified: json['isVerified'] is bool ? json['isVerified'] : null,
      language: json['language']?.toString(),
      lastLogin: json['lastLogin']?.toString(),
      lastLoginIp: json['lastLoginIp']?.toString(),
      passwordLastChanged: json['passwordLastChanged']?.toString(),
      phone: json['phone']?.toString(),
      registeredAt: json['registeredAt']?.toString(),
      status: json['status']?.toString(),
      thirdPartyBound: json['thirdPartyBound']?.toString(),
      twoFactorEnabled: json['twoFactorEnabled'] is bool ? json['twoFactorEnabled'] : null,
      username: json['username']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'avatarUrl': avatarUrl,
      'displayName': displayName,
      'email': email,
      'id': id,
      'isVerified': isVerified,
      'language': language,
      'lastLogin': lastLogin,
      'lastLoginIp': lastLoginIp,
      'passwordLastChanged': passwordLastChanged,
      'phone': phone,
      'registeredAt': registeredAt,
      'status': status,
      'thirdPartyBound': thirdPartyBound,
      'twoFactorEnabled': twoFactorEnabled,
      'username': username,
    };
  }
}

class IamUserSecuritySettingRecord {
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? id;
  final String? lastLoginAt;
  final String? lastLoginIpHash;
  final Map<String, dynamic>? metadata;
  final bool? mfaEnabled;
  final String? mfaMethod;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final String? passwordLastChangedAt;
  final String? securityLevel;
  final String? status;
  final String? tenantId;
  final Map<String, dynamic>? thirdPartyBoundSnapshot;
  final int? trustedDeviceCount;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;

  IamUserSecuritySettingRecord({
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.id,
    this.lastLoginAt,
    this.lastLoginIpHash,
    this.metadata,
    this.mfaEnabled,
    this.mfaMethod,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.passwordLastChangedAt,
    this.securityLevel,
    this.status,
    this.tenantId,
    this.thirdPartyBoundSnapshot,
    this.trustedDeviceCount,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version
  });

  factory IamUserSecuritySettingRecord.fromJson(Map<String, dynamic> json) {
    return IamUserSecuritySettingRecord(
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      id: json['id']?.toString(),
      lastLoginAt: json['last_login_at']?.toString(),
      lastLoginIpHash: json['last_login_ip_hash']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      mfaEnabled: json['mfa_enabled'] is bool ? json['mfa_enabled'] : null,
      mfaMethod: json['mfa_method']?.toString(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      passwordLastChangedAt: json['password_last_changed_at']?.toString(),
      securityLevel: json['security_level']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      thirdPartyBoundSnapshot: (() {
        final map = _sdkworkAsMap(json['third_party_bound_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      trustedDeviceCount: json['trusted_device_count'] is int ? json['trusted_device_count'] : null,
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'id': id,
      'last_login_at': lastLoginAt,
      'last_login_ip_hash': lastLoginIpHash,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mfa_enabled': mfaEnabled,
      'mfa_method': mfaMethod,
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'password_last_changed_at': passwordLastChangedAt,
      'security_level': securityLevel,
      'status': status,
      'tenant_id': tenantId,
      'third_party_bound_snapshot': thirdPartyBoundSnapshot?.map((key, item) => MapEntry(key, item)),
      'trusted_device_count': trustedDeviceCount,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IamVerificationCodeCreateRequest {
  final String? scene;
  final String? target;
  final String? verifyType;

  IamVerificationCodeCreateRequest({
    this.scene,
    this.target,
    this.verifyType
  });

  factory IamVerificationCodeCreateRequest.fromJson(Map<String, dynamic> json) {
    return IamVerificationCodeCreateRequest(
      scene: json['scene']?.toString(),
      target: json['target']?.toString(),
      verifyType: json['verifyType']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'scene': scene,
      'target': target,
      'verifyType': verifyType,
    };
  }
}

class IamVerificationCodeResponse {
  final String? codeId;
  final String? debugCode;
  final String? expiresAt;

  IamVerificationCodeResponse({
    this.codeId,
    this.debugCode,
    this.expiresAt
  });

  factory IamVerificationCodeResponse.fromJson(Map<String, dynamic> json) {
    return IamVerificationCodeResponse(
      codeId: json['codeId']?.toString(),
      debugCode: json['debugCode']?.toString(),
      expiresAt: json['expiresAt']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'codeId': codeId,
      'debugCode': debugCode,
      'expiresAt': expiresAt,
    };
  }
}

class IamVerificationCodeVerifyRequest {
  final String? code;
  final String? codeId;
  final String? scene;
  final String? target;
  final String? verifyType;

  IamVerificationCodeVerifyRequest({
    this.code,
    this.codeId,
    this.scene,
    this.target,
    this.verifyType
  });

  factory IamVerificationCodeVerifyRequest.fromJson(Map<String, dynamic> json) {
    return IamVerificationCodeVerifyRequest(
      code: json['code']?.toString(),
      codeId: json['codeId']?.toString(),
      scene: json['scene']?.toString(),
      target: json['target']?.toString(),
      verifyType: json['verifyType']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'codeId': codeId,
      'scene': scene,
      'target': target,
      'verifyType': verifyType,
    };
  }
}

class IamVerificationCodeVerifyResponse {
  final bool? valid;
  final bool? verified;

  IamVerificationCodeVerifyResponse({
    this.valid,
    this.verified
  });

  factory IamVerificationCodeVerifyResponse.fromJson(Map<String, dynamic> json) {
    return IamVerificationCodeVerifyResponse(
      valid: json['valid'] is bool ? json['valid'] : null,
      verified: json['verified'] is bool ? json['verified'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'valid': valid,
      'verified': verified,
    };
  }
}

class IntegrationChannelModelRecord {
  final String? capability;
  final String? catalogKey;
  final String? channelId;
  final String? createdAt;
  final String? dataScope;
  final Map<String, dynamic>? defaultParameters;
  final String? deletedAt;
  final String? deletedBy;
  final String? effectiveFrom;
  final String? effectiveTo;
  final String? id;
  final String? maxInputTokens;
  final String? maxOutputTokens;
  final Map<String, dynamic>? metadata;
  final String? model;
  final Map<String, dynamic>? modelAliases;
  final String? modelId;
  final String? organizationId;
  final String? providerModel;
  final String? status;
  final bool? supportsStreaming;
  final bool? supportsTools;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? vendorCode;
  final String? version;

  IntegrationChannelModelRecord({
    this.capability,
    this.catalogKey,
    this.channelId,
    this.createdAt,
    this.dataScope,
    this.defaultParameters,
    this.deletedAt,
    this.deletedBy,
    this.effectiveFrom,
    this.effectiveTo,
    this.id,
    this.maxInputTokens,
    this.maxOutputTokens,
    this.metadata,
    this.model,
    this.modelAliases,
    this.modelId,
    this.organizationId,
    this.providerModel,
    this.status,
    this.supportsStreaming,
    this.supportsTools,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.vendorCode,
    this.version
  });

  factory IntegrationChannelModelRecord.fromJson(Map<String, dynamic> json) {
    return IntegrationChannelModelRecord(
      capability: json['capability']?.toString(),
      catalogKey: json['catalog_key']?.toString(),
      channelId: json['channel_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultParameters: (() {
        final map = _sdkworkAsMap(json['default_parameters']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      effectiveFrom: json['effective_from']?.toString(),
      effectiveTo: json['effective_to']?.toString(),
      id: json['id']?.toString(),
      maxInputTokens: json['max_input_tokens']?.toString(),
      maxOutputTokens: json['max_output_tokens']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      model: json['model']?.toString(),
      modelAliases: (() {
        final map = _sdkworkAsMap(json['model_aliases']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modelId: json['model_id']?.toString(),
      organizationId: json['organization_id']?.toString(),
      providerModel: json['provider_model']?.toString(),
      status: json['status']?.toString(),
      supportsStreaming: json['supports_streaming'] is bool ? json['supports_streaming'] : null,
      supportsTools: json['supports_tools'] is bool ? json['supports_tools'] : null,
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      vendorCode: json['vendor_code']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'capability': capability,
      'catalog_key': catalogKey,
      'channel_id': channelId,
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_parameters': defaultParameters?.map((key, item) => MapEntry(key, item)),
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'effective_from': effectiveFrom,
      'effective_to': effectiveTo,
      'id': id,
      'max_input_tokens': maxInputTokens,
      'max_output_tokens': maxOutputTokens,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model': model,
      'model_aliases': modelAliases?.map((key, item) => MapEntry(key, item)),
      'model_id': modelId,
      'organization_id': organizationId,
      'provider_model': providerModel,
      'status': status,
      'supports_streaming': supportsStreaming,
      'supports_tools': supportsTools,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'vendor_code': vendorCode,
      'version': version,
    };
  }
}

class IntegrationChannelRecord {
  final String? accessType;
  final String? accountId;
  final String? baseUrlOverride;
  final Map<String, dynamic>? capabilities;
  final String? channelCode;
  final Map<String, dynamic>? circuitBreakerPolicy;
  final String? consecutiveErrorCount;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? environment;
  final String? healthStatus;
  final String? id;
  final int? lastLatencyMs;
  final Map<String, dynamic>? metadata;
  final String? modelMode;
  final String? name;
  final String? organizationId;
  final int? priority;
  final String? protocol;
  final String? providerCode;
  final String? providerId;
  final String? proxyId;
  final String? region;
  final Map<String, dynamic>? retryPolicy;
  final String? rpmLimit;
  final String? status;
  final String? tenantId;
  final int? timeoutMs;
  final String? updatedAt;
  final String? uuid;
  final String? version;
  final int? weight;

  IntegrationChannelRecord({
    this.accessType,
    this.accountId,
    this.baseUrlOverride,
    this.capabilities,
    this.channelCode,
    this.circuitBreakerPolicy,
    this.consecutiveErrorCount,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.environment,
    this.healthStatus,
    this.id,
    this.lastLatencyMs,
    this.metadata,
    this.modelMode,
    this.name,
    this.organizationId,
    this.priority,
    this.protocol,
    this.providerCode,
    this.providerId,
    this.proxyId,
    this.region,
    this.retryPolicy,
    this.rpmLimit,
    this.status,
    this.tenantId,
    this.timeoutMs,
    this.updatedAt,
    this.uuid,
    this.version,
    this.weight
  });

  factory IntegrationChannelRecord.fromJson(Map<String, dynamic> json) {
    return IntegrationChannelRecord(
      accessType: json['access_type']?.toString(),
      accountId: json['account_id']?.toString(),
      baseUrlOverride: json['base_url_override']?.toString(),
      capabilities: (() {
        final map = _sdkworkAsMap(json['capabilities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      channelCode: json['channel_code']?.toString(),
      circuitBreakerPolicy: (() {
        final map = _sdkworkAsMap(json['circuit_breaker_policy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      consecutiveErrorCount: json['consecutive_error_count']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      environment: json['environment']?.toString(),
      healthStatus: json['health_status']?.toString(),
      id: json['id']?.toString(),
      lastLatencyMs: json['last_latency_ms'] is int ? json['last_latency_ms'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      modelMode: json['model_mode']?.toString(),
      name: json['name']?.toString(),
      organizationId: json['organization_id']?.toString(),
      priority: json['priority'] is int ? json['priority'] : null,
      protocol: json['protocol']?.toString(),
      providerCode: json['provider_code']?.toString(),
      providerId: json['provider_id']?.toString(),
      proxyId: json['proxy_id']?.toString(),
      region: json['region']?.toString(),
      retryPolicy: (() {
        final map = _sdkworkAsMap(json['retry_policy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      rpmLimit: json['rpm_limit']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      timeoutMs: json['timeout_ms'] is int ? json['timeout_ms'] : null,
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      weight: json['weight'] is int ? json['weight'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'access_type': accessType,
      'account_id': accountId,
      'base_url_override': baseUrlOverride,
      'capabilities': capabilities?.map((key, item) => MapEntry(key, item)),
      'channel_code': channelCode,
      'circuit_breaker_policy': circuitBreakerPolicy?.map((key, item) => MapEntry(key, item)),
      'consecutive_error_count': consecutiveErrorCount,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'environment': environment,
      'health_status': healthStatus,
      'id': id,
      'last_latency_ms': lastLatencyMs,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'model_mode': modelMode,
      'name': name,
      'organization_id': organizationId,
      'priority': priority,
      'protocol': protocol,
      'provider_code': providerCode,
      'provider_id': providerId,
      'proxy_id': proxyId,
      'region': region,
      'retry_policy': retryPolicy?.map((key, item) => MapEntry(key, item)),
      'rpm_limit': rpmLimit,
      'status': status,
      'tenant_id': tenantId,
      'timeout_ms': timeoutMs,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
      'weight': weight,
    };
  }
}

class IntegrationProviderAccountRecord {
  final String? accountCode;
  final String? accountName;
  final Map<String, dynamic>? authConfig;
  final String? authType;
  final String? consecutiveErrorCount;
  final String? createdAt;
  final String? credentialProfile;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? externalAccountId;
  final String? id;
  final String? lastBalanceCheckedAt;
  final String? lastRotatedAt;
  final String? lastUsedAt;
  final String? lastVerifiedAt;
  final String? maskedLabel;
  final Map<String, dynamic>? metadata;
  final String? nextRotateAt;
  final String? organizationId;
  final String? providerCode;
  final String? providerId;
  final String? quotaLimit;
  final String? quotaUnit;
  final String? quotaUsed;
  final String? riskLevel;
  final String? secretHash;
  final String? secretRef;
  final Map<String, dynamic>? secretRotationPolicy;
  final String? secretVersion;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? upstreamBalanceAmount;
  final String? upstreamBalanceCurrency;
  final String? uuid;
  final String? version;

  IntegrationProviderAccountRecord({
    this.accountCode,
    this.accountName,
    this.authConfig,
    this.authType,
    this.consecutiveErrorCount,
    this.createdAt,
    this.credentialProfile,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.externalAccountId,
    this.id,
    this.lastBalanceCheckedAt,
    this.lastRotatedAt,
    this.lastUsedAt,
    this.lastVerifiedAt,
    this.maskedLabel,
    this.metadata,
    this.nextRotateAt,
    this.organizationId,
    this.providerCode,
    this.providerId,
    this.quotaLimit,
    this.quotaUnit,
    this.quotaUsed,
    this.riskLevel,
    this.secretHash,
    this.secretRef,
    this.secretRotationPolicy,
    this.secretVersion,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.upstreamBalanceAmount,
    this.upstreamBalanceCurrency,
    this.uuid,
    this.version
  });

  factory IntegrationProviderAccountRecord.fromJson(Map<String, dynamic> json) {
    return IntegrationProviderAccountRecord(
      accountCode: json['account_code']?.toString(),
      accountName: json['account_name']?.toString(),
      authConfig: (() {
        final map = _sdkworkAsMap(json['auth_config']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      authType: json['auth_type']?.toString(),
      consecutiveErrorCount: json['consecutive_error_count']?.toString(),
      createdAt: json['created_at']?.toString(),
      credentialProfile: json['credential_profile']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      externalAccountId: json['external_account_id']?.toString(),
      id: json['id']?.toString(),
      lastBalanceCheckedAt: json['last_balance_checked_at']?.toString(),
      lastRotatedAt: json['last_rotated_at']?.toString(),
      lastUsedAt: json['last_used_at']?.toString(),
      lastVerifiedAt: json['last_verified_at']?.toString(),
      maskedLabel: json['masked_label']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      nextRotateAt: json['next_rotate_at']?.toString(),
      organizationId: json['organization_id']?.toString(),
      providerCode: json['provider_code']?.toString(),
      providerId: json['provider_id']?.toString(),
      quotaLimit: json['quota_limit']?.toString(),
      quotaUnit: json['quota_unit']?.toString(),
      quotaUsed: json['quota_used']?.toString(),
      riskLevel: json['risk_level']?.toString(),
      secretHash: json['secret_hash']?.toString(),
      secretRef: json['secret_ref']?.toString(),
      secretRotationPolicy: (() {
        final map = _sdkworkAsMap(json['secret_rotation_policy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      secretVersion: json['secret_version']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      upstreamBalanceAmount: json['upstream_balance_amount']?.toString(),
      upstreamBalanceCurrency: json['upstream_balance_currency']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'account_code': accountCode,
      'account_name': accountName,
      'auth_config': authConfig?.map((key, item) => MapEntry(key, item)),
      'auth_type': authType,
      'consecutive_error_count': consecutiveErrorCount,
      'created_at': createdAt,
      'credential_profile': credentialProfile,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'external_account_id': externalAccountId,
      'id': id,
      'last_balance_checked_at': lastBalanceCheckedAt,
      'last_rotated_at': lastRotatedAt,
      'last_used_at': lastUsedAt,
      'last_verified_at': lastVerifiedAt,
      'masked_label': maskedLabel,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'next_rotate_at': nextRotateAt,
      'organization_id': organizationId,
      'provider_code': providerCode,
      'provider_id': providerId,
      'quota_limit': quotaLimit,
      'quota_unit': quotaUnit,
      'quota_used': quotaUsed,
      'risk_level': riskLevel,
      'secret_hash': secretHash,
      'secret_ref': secretRef,
      'secret_rotation_policy': secretRotationPolicy?.map((key, item) => MapEntry(key, item)),
      'secret_version': secretVersion,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'upstream_balance_amount': upstreamBalanceAmount,
      'upstream_balance_currency': upstreamBalanceCurrency,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IntegrationProviderHealthSnapshotRecord {
  final String? channelId;
  final String? checkType;
  final String? checkedAt;
  final String? createdAt;
  final String? errorCode;
  final String? errorMessageMasked;
  final String? healthStatus;
  final int? httpStatus;
  final String? id;
  final int? latencyMs;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? providerAccountId;
  final String? providerId;
  final Map<String, dynamic>? quotaSnapshot;
  final String? requestId;
  final String? retentionUntil;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userId;
  final String? uuid;

  IntegrationProviderHealthSnapshotRecord({
    this.channelId,
    this.checkType,
    this.checkedAt,
    this.createdAt,
    this.errorCode,
    this.errorMessageMasked,
    this.healthStatus,
    this.httpStatus,
    this.id,
    this.latencyMs,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.providerAccountId,
    this.providerId,
    this.quotaSnapshot,
    this.requestId,
    this.retentionUntil,
    this.status,
    this.tenantId,
    this.traceId,
    this.userId,
    this.uuid
  });

  factory IntegrationProviderHealthSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return IntegrationProviderHealthSnapshotRecord(
      channelId: json['channel_id']?.toString(),
      checkType: json['check_type']?.toString(),
      checkedAt: json['checked_at']?.toString(),
      createdAt: json['created_at']?.toString(),
      errorCode: json['error_code']?.toString(),
      errorMessageMasked: json['error_message_masked']?.toString(),
      healthStatus: json['health_status']?.toString(),
      httpStatus: json['http_status'] is int ? json['http_status'] : null,
      id: json['id']?.toString(),
      latencyMs: json['latency_ms'] is int ? json['latency_ms'] : null,
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      providerAccountId: json['provider_account_id']?.toString(),
      providerId: json['provider_id']?.toString(),
      quotaSnapshot: (() {
        final map = _sdkworkAsMap(json['quota_snapshot']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channel_id': channelId,
      'check_type': checkType,
      'checked_at': checkedAt,
      'created_at': createdAt,
      'error_code': errorCode,
      'error_message_masked': errorMessageMasked,
      'health_status': healthStatus,
      'http_status': httpStatus,
      'id': id,
      'latency_ms': latencyMs,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'provider_account_id': providerAccountId,
      'provider_id': providerId,
      'quota_snapshot': quotaSnapshot?.map((key, item) => MapEntry(key, item)),
      'request_id': requestId,
      'retention_until': retentionUntil,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class IntegrationProviderRecord {
  final String? authType;
  final String? baseUrlTemplate;
  final Map<String, dynamic>? capabilities;
  final String? colorToken;
  final String? createdAt;
  final String? dataScope;
  final String? defaultVendorCode;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? displayName;
  final String? docsUrl;
  final String? iconUrl;
  final String? id;
  final String? integrationType;
  final Map<String, dynamic>? metadata;
  final String? metadataSchemaVersion;
  final String? organizationId;
  final String? protocol;
  final String? providerCode;
  final int? sortOrder;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? upstreamProviderCode;
  final String? upstreamVendorCode;
  final String? uuid;
  final String? version;
  final String? websiteUrl;

  IntegrationProviderRecord({
    this.authType,
    this.baseUrlTemplate,
    this.capabilities,
    this.colorToken,
    this.createdAt,
    this.dataScope,
    this.defaultVendorCode,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.displayName,
    this.docsUrl,
    this.iconUrl,
    this.id,
    this.integrationType,
    this.metadata,
    this.metadataSchemaVersion,
    this.organizationId,
    this.protocol,
    this.providerCode,
    this.sortOrder,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.upstreamProviderCode,
    this.upstreamVendorCode,
    this.uuid,
    this.version,
    this.websiteUrl
  });

  factory IntegrationProviderRecord.fromJson(Map<String, dynamic> json) {
    return IntegrationProviderRecord(
      authType: json['auth_type']?.toString(),
      baseUrlTemplate: json['base_url_template']?.toString(),
      capabilities: (() {
        final map = _sdkworkAsMap(json['capabilities']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      colorToken: json['color_token']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      defaultVendorCode: json['default_vendor_code']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      displayName: json['display_name']?.toString(),
      docsUrl: json['docs_url']?.toString(),
      iconUrl: json['icon_url']?.toString(),
      id: json['id']?.toString(),
      integrationType: json['integration_type']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      metadataSchemaVersion: json['metadata_schema_version']?.toString(),
      organizationId: json['organization_id']?.toString(),
      protocol: json['protocol']?.toString(),
      providerCode: json['provider_code']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      upstreamProviderCode: json['upstream_provider_code']?.toString(),
      upstreamVendorCode: json['upstream_vendor_code']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      websiteUrl: json['website_url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'auth_type': authType,
      'base_url_template': baseUrlTemplate,
      'capabilities': capabilities?.map((key, item) => MapEntry(key, item)),
      'color_token': colorToken,
      'created_at': createdAt,
      'data_scope': dataScope,
      'default_vendor_code': defaultVendorCode,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'display_name': displayName,
      'docs_url': docsUrl,
      'icon_url': iconUrl,
      'id': id,
      'integration_type': integrationType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'metadata_schema_version': metadataSchemaVersion,
      'organization_id': organizationId,
      'protocol': protocol,
      'provider_code': providerCode,
      'sort_order': sortOrder,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'upstream_provider_code': upstreamProviderCode,
      'upstream_vendor_code': upstreamVendorCode,
      'uuid': uuid,
      'version': version,
      'website_url': websiteUrl,
    };
  }
}

class IntegrationProxyRecord {
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? description;
  final String? endpoint;
  final String? healthStatus;
  final String? id;
  final String? lastCheckedAt;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? proxyCode;
  final String? proxyType;
  final String? region;
  final String? secretHash;
  final String? secretRef;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  IntegrationProxyRecord({
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.description,
    this.endpoint,
    this.healthStatus,
    this.id,
    this.lastCheckedAt,
    this.metadata,
    this.organizationId,
    this.proxyCode,
    this.proxyType,
    this.region,
    this.secretHash,
    this.secretRef,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory IntegrationProxyRecord.fromJson(Map<String, dynamic> json) {
    return IntegrationProxyRecord(
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      description: json['description']?.toString(),
      endpoint: json['endpoint']?.toString(),
      healthStatus: json['health_status']?.toString(),
      id: json['id']?.toString(),
      lastCheckedAt: json['last_checked_at']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      proxyCode: json['proxy_code']?.toString(),
      proxyType: json['proxy_type']?.toString(),
      region: json['region']?.toString(),
      secretHash: json['secret_hash']?.toString(),
      secretRef: json['secret_ref']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'description': description,
      'endpoint': endpoint,
      'health_status': healthStatus,
      'id': id,
      'last_checked_at': lastCheckedAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'proxy_code': proxyCode,
      'proxy_type': proxyType,
      'region': region,
      'secret_hash': secretHash,
      'secret_ref': secretRef,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class IntegrationWebhookEndpointRecord {
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? endpointCode;
  final Map<String, dynamic>? eventTypes;
  final String? failureCount;
  final String? id;
  final String? lastFailureAt;
  final String? lastSuccessAt;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final Map<String, dynamic>? retryPolicy;
  final String? secretHash;
  final String? secretRef;
  final String? signingAlg;
  final String? status;
  final String? targetUrl;
  final String? tenantId;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;

  IntegrationWebhookEndpointRecord({
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.endpointCode,
    this.eventTypes,
    this.failureCount,
    this.id,
    this.lastFailureAt,
    this.lastSuccessAt,
    this.metadata,
    this.name,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.retryPolicy,
    this.secretHash,
    this.secretRef,
    this.signingAlg,
    this.status,
    this.targetUrl,
    this.tenantId,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version
  });

  factory IntegrationWebhookEndpointRecord.fromJson(Map<String, dynamic> json) {
    return IntegrationWebhookEndpointRecord(
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      endpointCode: json['endpoint_code']?.toString(),
      eventTypes: (() {
        final map = _sdkworkAsMap(json['event_types']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      failureCount: json['failure_count']?.toString(),
      id: json['id']?.toString(),
      lastFailureAt: json['last_failure_at']?.toString(),
      lastSuccessAt: json['last_success_at']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      name: json['name']?.toString(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      retryPolicy: (() {
        final map = _sdkworkAsMap(json['retry_policy']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      secretHash: json['secret_hash']?.toString(),
      secretRef: json['secret_ref']?.toString(),
      signingAlg: json['signing_alg']?.toString(),
      status: json['status']?.toString(),
      targetUrl: json['target_url']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'endpoint_code': endpointCode,
      'event_types': eventTypes?.map((key, item) => MapEntry(key, item)),
      'failure_count': failureCount,
      'id': id,
      'last_failure_at': lastFailureAt,
      'last_success_at': lastSuccessAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'retry_policy': retryPolicy?.map((key, item) => MapEntry(key, item)),
      'secret_hash': secretHash,
      'secret_ref': secretRef,
      'signing_alg': signingAlg,
      'status': status,
      'target_url': targetUrl,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
    };
  }
}

class LoginQrCodesCreateResult {
  final String? code;
  final IamLoginQrCodeResponse? data;
  final String? message;
  final String? msg;

  LoginQrCodesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory LoginQrCodesCreateResult.fromJson(Map<String, dynamic> json) {
    return LoginQrCodesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamLoginQrCodeResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class LoginQrCodesRetrieveResult {
  final String? code;
  final IamLoginQrCodeStatusResponse? data;
  final String? message;
  final String? msg;

  LoginQrCodesRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory LoginQrCodesRetrieveResult.fromJson(Map<String, dynamic> json) {
    return LoginQrCodesRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamLoginQrCodeStatusResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class Message {
  final String? content;
  final String? desc;
  final String? id;
  final bool? read;
  final String? time;
  final String? title;
  final String? type;

  Message({
    this.content,
    this.desc,
    this.id,
    this.read,
    this.time,
    this.title,
    this.type
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      content: json['content']?.toString(),
      desc: json['desc']?.toString(),
      id: json['id']?.toString(),
      read: json['read'] is bool ? json['read'] : null,
      time: json['time']?.toString(),
      title: json['title']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'content': content,
      'desc': desc,
      'id': id,
      'read': read,
      'time': time,
      'title': title,
      'type': type,
    };
  }
}

class MessagesResponse {
  final List<Message>? items;

  MessagesResponse({
    this.items
  });

  factory MessagesResponse.fromJson(Map<String, dynamic> json) {
    return MessagesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : Message.fromJson(map);
      })())
            .whereType<Message>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class ModelRankingHistoryEntry {
  final String? catalogKey;
  final String? color;
  final String? model;
  final int? rank;
  final int? volume;

  ModelRankingHistoryEntry({
    this.catalogKey,
    this.color,
    this.model,
    this.rank,
    this.volume
  });

  factory ModelRankingHistoryEntry.fromJson(Map<String, dynamic> json) {
    return ModelRankingHistoryEntry(
      catalogKey: json['catalogKey']?.toString(),
      color: json['color']?.toString(),
      model: json['model']?.toString(),
      rank: json['rank'] is int ? json['rank'] : null,
      volume: json['volume'] is int ? json['volume'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'catalogKey': catalogKey,
      'color': color,
      'model': model,
      'rank': rank,
      'volume': volume,
    };
  }
}

class ModelRankingHistoryPoint {
  final String? date;
  final List<ModelRankingHistoryEntry>? entries;
  final int? index;

  ModelRankingHistoryPoint({
    this.date,
    this.entries,
    this.index
  });

  factory ModelRankingHistoryPoint.fromJson(Map<String, dynamic> json) {
    return ModelRankingHistoryPoint(
      date: json['date']?.toString(),
      entries: (() {
        final list = _sdkworkAsList(json['entries']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ModelRankingHistoryEntry.fromJson(map);
      })())
            .whereType<ModelRankingHistoryEntry>()
            .toList();
      })(),
      index: json['index'] is int ? json['index'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'date': date,
      'entries': entries?.map((item) => item.toJson()).toList(),
      'index': index,
    };
  }
}

class ModelRankingItem {
  final int? baseVolume;
  final String? color;
  final String? contextSize;
  final double? cost;
  final int? costIndicator;
  final String? currency;
  final String? id;
  final bool? isNew;
  final int? latency;
  final String? license;
  final String? modality;
  final String? name;
  final int? prevRank;
  final String? pricing;
  final int? rank;
  final int? requests;
  final List<String>? strengths;
  final int? tokens;
  final double? trendScore;
  final String? vendor;
  final String? vendorCode;
  final double? winRate;

  ModelRankingItem({
    this.baseVolume,
    this.color,
    this.contextSize,
    this.cost,
    this.costIndicator,
    this.currency,
    this.id,
    this.isNew,
    this.latency,
    this.license,
    this.modality,
    this.name,
    this.prevRank,
    this.pricing,
    this.rank,
    this.requests,
    this.strengths,
    this.tokens,
    this.trendScore,
    this.vendor,
    this.vendorCode,
    this.winRate
  });

  factory ModelRankingItem.fromJson(Map<String, dynamic> json) {
    return ModelRankingItem(
      baseVolume: json['baseVolume'] is int ? json['baseVolume'] : null,
      color: json['color']?.toString(),
      contextSize: json['contextSize']?.toString(),
      cost: json['cost'] is num ? json['cost'].toDouble() : null,
      costIndicator: json['costIndicator'] is int ? json['costIndicator'] : null,
      currency: json['currency']?.toString(),
      id: json['id']?.toString(),
      isNew: json['isNew'] is bool ? json['isNew'] : null,
      latency: json['latency'] is int ? json['latency'] : null,
      license: json['license']?.toString(),
      modality: json['modality']?.toString(),
      name: json['name']?.toString(),
      prevRank: json['prevRank'] is int ? json['prevRank'] : null,
      pricing: json['pricing']?.toString(),
      rank: json['rank'] is int ? json['rank'] : null,
      requests: json['requests'] is int ? json['requests'] : null,
      strengths: (() {
        final list = _sdkworkAsList(json['strengths']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      tokens: json['tokens'] is int ? json['tokens'] : null,
      trendScore: json['trendScore'] is num ? json['trendScore'].toDouble() : null,
      vendor: json['vendor']?.toString(),
      vendorCode: json['vendorCode']?.toString(),
      winRate: json['winRate'] is num ? json['winRate'].toDouble() : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'baseVolume': baseVolume,
      'color': color,
      'contextSize': contextSize,
      'cost': cost,
      'costIndicator': costIndicator,
      'currency': currency,
      'id': id,
      'isNew': isNew,
      'latency': latency,
      'license': license,
      'modality': modality,
      'name': name,
      'prevRank': prevRank,
      'pricing': pricing,
      'rank': rank,
      'requests': requests,
      'strengths': strengths?.map((item) => item).toList(),
      'tokens': tokens,
      'trendScore': trendScore,
      'vendor': vendor,
      'vendorCode': vendorCode,
      'winRate': winRate,
    };
  }
}

class ModelRankingsListResult {
  final String? code;
  final ModelRankingsSnapshot? data;
  final String? message;
  final String? msg;

  ModelRankingsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ModelRankingsListResult.fromJson(Map<String, dynamic> json) {
    return ModelRankingsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ModelRankingsSnapshot.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class ModelRankingsSnapshot {
  final List<ModelRankingHistoryPoint>? history;
  final List<ModelRankingItem>? items;
  final ModelRankingsSource? source;

  ModelRankingsSnapshot({
    this.history,
    this.items,
    this.source
  });

  factory ModelRankingsSnapshot.fromJson(Map<String, dynamic> json) {
    return ModelRankingsSnapshot(
      history: (() {
        final list = _sdkworkAsList(json['history']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ModelRankingHistoryPoint.fromJson(map);
      })())
            .whereType<ModelRankingHistoryPoint>()
            .toList();
      })(),
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ModelRankingItem.fromJson(map);
      })())
            .whereType<ModelRankingItem>()
            .toList();
      })(),
      source: (() {
        final map = _sdkworkAsMap(json['source']);
        return map == null ? null : ModelRankingsSource.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'history': history?.map((item) => item.toJson()).toList(),
      'items': items?.map((item) => item.toJson()).toList(),
      'source': source?.toJson(),
    };
  }
}

class ModelRankingsSource {
  final int? cacheMaxAgeSeconds;
  final String? generatedAt;
  final String? nextRefreshAt;
  final String? observedAt;
  final String? rankScope;
  final int? refreshIntervalSeconds;
  final String? snapshotDate;
  final String? snapshotPeriod;
  final String? sourceDescription;
  final String? sourceLabel;
  final List<String>? sourceTables;
  final String? windowEnd;
  final String? windowStart;

  ModelRankingsSource({
    this.cacheMaxAgeSeconds,
    this.generatedAt,
    this.nextRefreshAt,
    this.observedAt,
    this.rankScope,
    this.refreshIntervalSeconds,
    this.snapshotDate,
    this.snapshotPeriod,
    this.sourceDescription,
    this.sourceLabel,
    this.sourceTables,
    this.windowEnd,
    this.windowStart
  });

  factory ModelRankingsSource.fromJson(Map<String, dynamic> json) {
    return ModelRankingsSource(
      cacheMaxAgeSeconds: json['cacheMaxAgeSeconds'] is int ? json['cacheMaxAgeSeconds'] : null,
      generatedAt: json['generatedAt']?.toString(),
      nextRefreshAt: json['nextRefreshAt']?.toString(),
      observedAt: json['observedAt']?.toString(),
      rankScope: json['rankScope']?.toString(),
      refreshIntervalSeconds: json['refreshIntervalSeconds'] is int ? json['refreshIntervalSeconds'] : null,
      snapshotDate: json['snapshotDate']?.toString(),
      snapshotPeriod: json['snapshotPeriod']?.toString(),
      sourceDescription: json['sourceDescription']?.toString(),
      sourceLabel: json['sourceLabel']?.toString(),
      sourceTables: (() {
        final list = _sdkworkAsList(json['sourceTables']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      windowEnd: json['windowEnd']?.toString(),
      windowStart: json['windowStart']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cacheMaxAgeSeconds': cacheMaxAgeSeconds,
      'generatedAt': generatedAt,
      'nextRefreshAt': nextRefreshAt,
      'observedAt': observedAt,
      'rankScope': rankScope,
      'refreshIntervalSeconds': refreshIntervalSeconds,
      'snapshotDate': snapshotDate,
      'snapshotPeriod': snapshotPeriod,
      'sourceDescription': sourceDescription,
      'sourceLabel': sourceLabel,
      'sourceTables': sourceTables?.map((item) => item).toList(),
      'windowEnd': windowEnd,
      'windowStart': windowStart,
    };
  }
}

class ModelVendorsListResult {
  final String? code;
  final RankingVendorOptionsResponse? data;
  final String? message;
  final String? msg;

  ModelVendorsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ModelVendorsListResult.fromJson(Map<String, dynamic> json) {
    return ModelVendorsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RankingVendorOptionsResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class ModelsListResult {
  final String? code;
  final AppModelCatalogResponse? data;
  final String? message;
  final String? msg;

  ModelsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ModelsListResult.fromJson(Map<String, dynamic> json) {
    return ModelsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppModelCatalogResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class NoData {


  NoData();

  factory NoData.fromJson(Map<String, dynamic> json) {
    return NoData();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class NotificationsListResult {
  final String? code;
  final MessagesResponse? data;
  final String? message;
  final String? msg;

  NotificationsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory NotificationsListResult.fromJson(Map<String, dynamic> json) {
    return NotificationsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : MessagesResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class OauthAuthorizationUrlsRetrieveResult {
  final String? code;
  final IamOauthAuthorizationUrlResponse? data;
  final String? message;
  final String? msg;

  OauthAuthorizationUrlsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory OauthAuthorizationUrlsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return OauthAuthorizationUrlsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamOauthAuthorizationUrlResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class OauthSessionsCreateResult {
  final String? code;
  final IamSessionResponse? data;
  final String? message;
  final String? msg;

  OauthSessionsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory OauthSessionsCreateResult.fromJson(Map<String, dynamic> json) {
    return OauthSessionsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class OpsAlertEventRecord {
  final String? alertNo;
  final String? alertStatus;
  final String? createdAt;
  final String? firstSeenAt;
  final String? id;
  final String? lastSeenAt;
  final bool? legalHold;
  final String? message;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? requestId;
  final String? resolvedAt;
  final String? resolvedBy;
  final String? retentionUntil;
  final String? severity;
  final String? source;
  final String? status;
  final String? tenantId;
  final String? title;
  final String? traceId;
  final String? userId;
  final String? uuid;

  OpsAlertEventRecord({
    this.alertNo,
    this.alertStatus,
    this.createdAt,
    this.firstSeenAt,
    this.id,
    this.lastSeenAt,
    this.legalHold,
    this.message,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.requestId,
    this.resolvedAt,
    this.resolvedBy,
    this.retentionUntil,
    this.severity,
    this.source,
    this.status,
    this.tenantId,
    this.title,
    this.traceId,
    this.userId,
    this.uuid
  });

  factory OpsAlertEventRecord.fromJson(Map<String, dynamic> json) {
    return OpsAlertEventRecord(
      alertNo: json['alert_no']?.toString(),
      alertStatus: json['alert_status']?.toString(),
      createdAt: json['created_at']?.toString(),
      firstSeenAt: json['first_seen_at']?.toString(),
      id: json['id']?.toString(),
      lastSeenAt: json['last_seen_at']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      message: json['message']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      requestId: json['request_id']?.toString(),
      resolvedAt: json['resolved_at']?.toString(),
      resolvedBy: json['resolved_by']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      severity: json['severity']?.toString(),
      source: json['source']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'alert_no': alertNo,
      'alert_status': alertStatus,
      'created_at': createdAt,
      'first_seen_at': firstSeenAt,
      'id': id,
      'last_seen_at': lastSeenAt,
      'legal_hold': legalHold,
      'message': message,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'request_id': requestId,
      'resolved_at': resolvedAt,
      'resolved_by': resolvedBy,
      'retention_until': retentionUntil,
      'severity': severity,
      'source': source,
      'status': status,
      'tenant_id': tenantId,
      'title': title,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class OpsAuditLogRecord {
  final String? action;
  final String? afterHash;
  final String? approvalId;
  final String? beforeHash;
  final Map<String, dynamic>? changeSummary;
  final String? clientIpHash;
  final String? createdAt;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? operatorId;
  final String? operatorNameSnapshot;
  final String? operatorType;
  final String? organizationId;
  final String? requestId;
  final String? retentionUntil;
  final String? riskLevel;
  final String? targetId;
  final String? targetType;
  final String? targetUuid;
  final String? tenantId;
  final String? traceId;
  final String? userAgentHash;
  final String? uuid;

  OpsAuditLogRecord({
    this.action,
    this.afterHash,
    this.approvalId,
    this.beforeHash,
    this.changeSummary,
    this.clientIpHash,
    this.createdAt,
    this.id,
    this.legalHold,
    this.metadata,
    this.operatorId,
    this.operatorNameSnapshot,
    this.operatorType,
    this.organizationId,
    this.requestId,
    this.retentionUntil,
    this.riskLevel,
    this.targetId,
    this.targetType,
    this.targetUuid,
    this.tenantId,
    this.traceId,
    this.userAgentHash,
    this.uuid
  });

  factory OpsAuditLogRecord.fromJson(Map<String, dynamic> json) {
    return OpsAuditLogRecord(
      action: json['action']?.toString(),
      afterHash: json['after_hash']?.toString(),
      approvalId: json['approval_id']?.toString(),
      beforeHash: json['before_hash']?.toString(),
      changeSummary: (() {
        final map = _sdkworkAsMap(json['change_summary']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      clientIpHash: json['client_ip_hash']?.toString(),
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      operatorId: json['operator_id']?.toString(),
      operatorNameSnapshot: json['operator_name_snapshot']?.toString(),
      operatorType: json['operator_type']?.toString(),
      organizationId: json['organization_id']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      riskLevel: json['risk_level']?.toString(),
      targetId: json['target_id']?.toString(),
      targetType: json['target_type']?.toString(),
      targetUuid: json['target_uuid']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userAgentHash: json['user_agent_hash']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'action': action,
      'after_hash': afterHash,
      'approval_id': approvalId,
      'before_hash': beforeHash,
      'change_summary': changeSummary?.map((key, item) => MapEntry(key, item)),
      'client_ip_hash': clientIpHash,
      'created_at': createdAt,
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'operator_id': operatorId,
      'operator_name_snapshot': operatorNameSnapshot,
      'operator_type': operatorType,
      'organization_id': organizationId,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'risk_level': riskLevel,
      'target_id': targetId,
      'target_type': targetType,
      'target_uuid': targetUuid,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_agent_hash': userAgentHash,
      'uuid': uuid,
    };
  }
}

class OpsConfigSnapshotRecord {
  final String? configHash;
  final Map<String, dynamic>? configPayload;
  final String? configScope;
  final String? configType;
  final String? createdAt;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? publishedAt;
  final String? publishedBy;
  final String? requestId;
  final String? retentionUntil;
  final String? rollbackFromSnapshotId;
  final String? snapshotNo;
  final Map<String, dynamic>? sourceIds;
  final String? sourceTable;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userId;
  final String? uuid;

  OpsConfigSnapshotRecord({
    this.configHash,
    this.configPayload,
    this.configScope,
    this.configType,
    this.createdAt,
    this.id,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.publishedAt,
    this.publishedBy,
    this.requestId,
    this.retentionUntil,
    this.rollbackFromSnapshotId,
    this.snapshotNo,
    this.sourceIds,
    this.sourceTable,
    this.status,
    this.tenantId,
    this.traceId,
    this.userId,
    this.uuid
  });

  factory OpsConfigSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return OpsConfigSnapshotRecord(
      configHash: json['config_hash']?.toString(),
      configPayload: (() {
        final map = _sdkworkAsMap(json['config_payload']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      configScope: json['config_scope']?.toString(),
      configType: json['config_type']?.toString(),
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      publishedAt: json['published_at']?.toString(),
      publishedBy: json['published_by']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      rollbackFromSnapshotId: json['rollback_from_snapshot_id']?.toString(),
      snapshotNo: json['snapshot_no']?.toString(),
      sourceIds: (() {
        final map = _sdkworkAsMap(json['source_ids']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      sourceTable: json['source_table']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'config_hash': configHash,
      'config_payload': configPayload?.map((key, item) => MapEntry(key, item)),
      'config_scope': configScope,
      'config_type': configType,
      'created_at': createdAt,
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'published_at': publishedAt,
      'published_by': publishedBy,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'rollback_from_snapshot_id': rollbackFromSnapshotId,
      'snapshot_no': snapshotNo,
      'source_ids': sourceIds?.map((key, item) => MapEntry(key, item)),
      'source_table': sourceTable,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class OpsCouponIssueBatchRecord {
  final Map<String, dynamic>? audienceFilter;
  final String? availableCount;
  final String? batchNo;
  final String? campaignCode;
  final String? claimedCount;
  final String? codePattern;
  final String? codePrefix;
  final String? couponId;
  final String? couponTemplateId;
  final String? createdAt;
  final String? createdBy;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? expireAt;
  final String? generatedAt;
  final String? generatedCount;
  final String? generationStatus;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? name;
  final String? organizationId;
  final String? requestedCount;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? usedCount;
  final String? uuid;
  final String? version;
  final String? voidedCount;

  OpsCouponIssueBatchRecord({
    this.audienceFilter,
    this.availableCount,
    this.batchNo,
    this.campaignCode,
    this.claimedCount,
    this.codePattern,
    this.codePrefix,
    this.couponId,
    this.couponTemplateId,
    this.createdAt,
    this.createdBy,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.expireAt,
    this.generatedAt,
    this.generatedCount,
    this.generationStatus,
    this.id,
    this.metadata,
    this.name,
    this.organizationId,
    this.requestedCount,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.usedCount,
    this.uuid,
    this.version,
    this.voidedCount
  });

  factory OpsCouponIssueBatchRecord.fromJson(Map<String, dynamic> json) {
    return OpsCouponIssueBatchRecord(
      audienceFilter: (() {
        final map = _sdkworkAsMap(json['audience_filter']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      availableCount: json['available_count']?.toString(),
      batchNo: json['batch_no']?.toString(),
      campaignCode: json['campaign_code']?.toString(),
      claimedCount: json['claimed_count']?.toString(),
      codePattern: json['code_pattern']?.toString(),
      codePrefix: json['code_prefix']?.toString(),
      couponId: json['coupon_id']?.toString(),
      couponTemplateId: json['coupon_template_id']?.toString(),
      createdAt: json['created_at']?.toString(),
      createdBy: json['created_by']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      expireAt: json['expire_at']?.toString(),
      generatedAt: json['generated_at']?.toString(),
      generatedCount: json['generated_count']?.toString(),
      generationStatus: json['generation_status']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      name: json['name']?.toString(),
      organizationId: json['organization_id']?.toString(),
      requestedCount: json['requested_count']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      usedCount: json['used_count']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      voidedCount: json['voided_count']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audience_filter': audienceFilter?.map((key, item) => MapEntry(key, item)),
      'available_count': availableCount,
      'batch_no': batchNo,
      'campaign_code': campaignCode,
      'claimed_count': claimedCount,
      'code_pattern': codePattern,
      'code_prefix': codePrefix,
      'coupon_id': couponId,
      'coupon_template_id': couponTemplateId,
      'created_at': createdAt,
      'created_by': createdBy,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'expire_at': expireAt,
      'generated_at': generatedAt,
      'generated_count': generatedCount,
      'generation_status': generationStatus,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'name': name,
      'organization_id': organizationId,
      'requested_count': requestedCount,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'used_count': usedCount,
      'uuid': uuid,
      'version': version,
      'voided_count': voidedCount,
    };
  }
}

class OpsGatewayHeartbeatRecord {
  final String? activeConnections;
  final String? cpuPercent;
  final String? createdAt;
  final String? diskPercent;
  final String? heartbeatAt;
  final String? id;
  final String? instanceId;
  final bool? legalHold;
  final String? memoryPercent;
  final Map<String, dynamic>? metadata;
  final String? networkInBytes;
  final String? networkOutBytes;
  final String? openFileCount;
  final String? organizationId;
  final Map<String, dynamic>? payload;
  final String? payloadHash;
  final String? requestId;
  final String? retentionUntil;
  final String? status;
  final String? tenantId;
  final String? threadCount;
  final String? traceId;
  final String? uptimeSeconds;
  final String? userId;
  final String? uuid;

  OpsGatewayHeartbeatRecord({
    this.activeConnections,
    this.cpuPercent,
    this.createdAt,
    this.diskPercent,
    this.heartbeatAt,
    this.id,
    this.instanceId,
    this.legalHold,
    this.memoryPercent,
    this.metadata,
    this.networkInBytes,
    this.networkOutBytes,
    this.openFileCount,
    this.organizationId,
    this.payload,
    this.payloadHash,
    this.requestId,
    this.retentionUntil,
    this.status,
    this.tenantId,
    this.threadCount,
    this.traceId,
    this.uptimeSeconds,
    this.userId,
    this.uuid
  });

  factory OpsGatewayHeartbeatRecord.fromJson(Map<String, dynamic> json) {
    return OpsGatewayHeartbeatRecord(
      activeConnections: json['active_connections']?.toString(),
      cpuPercent: json['cpu_percent']?.toString(),
      createdAt: json['created_at']?.toString(),
      diskPercent: json['disk_percent']?.toString(),
      heartbeatAt: json['heartbeat_at']?.toString(),
      id: json['id']?.toString(),
      instanceId: json['instance_id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      memoryPercent: json['memory_percent']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      networkInBytes: json['network_in_bytes']?.toString(),
      networkOutBytes: json['network_out_bytes']?.toString(),
      openFileCount: json['open_file_count']?.toString(),
      organizationId: json['organization_id']?.toString(),
      payload: (() {
        final map = _sdkworkAsMap(json['payload']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      payloadHash: json['payload_hash']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      threadCount: json['thread_count']?.toString(),
      traceId: json['trace_id']?.toString(),
      uptimeSeconds: json['uptime_seconds']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'active_connections': activeConnections,
      'cpu_percent': cpuPercent,
      'created_at': createdAt,
      'disk_percent': diskPercent,
      'heartbeat_at': heartbeatAt,
      'id': id,
      'instance_id': instanceId,
      'legal_hold': legalHold,
      'memory_percent': memoryPercent,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'network_in_bytes': networkInBytes,
      'network_out_bytes': networkOutBytes,
      'open_file_count': openFileCount,
      'organization_id': organizationId,
      'payload': payload?.map((key, item) => MapEntry(key, item)),
      'payload_hash': payloadHash,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'status': status,
      'tenant_id': tenantId,
      'thread_count': threadCount,
      'trace_id': traceId,
      'uptime_seconds': uptimeSeconds,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class OpsGatewayInstanceRecord {
  final String? cell;
  final String? configHash;
  final String? containerIdHash;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? deploymentMode;
  final String? desktopDeviceHash;
  final String? healthStatus;
  final String? hostName;
  final String? id;
  final String? instanceCode;
  final String? ipAddressHash;
  final String? ipAddressMasked;
  final String? lastHeartbeatAt;
  final Map<String, dynamic>? metadata;
  final String? nodeName;
  final String? orchestrator;
  final String? organizationId;
  final String? podName;
  final String? region;
  final String? runtimeType_;
  final String? startedAt;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;
  final String? versionName;

  OpsGatewayInstanceRecord({
    this.cell,
    this.configHash,
    this.containerIdHash,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.deploymentMode,
    this.desktopDeviceHash,
    this.healthStatus,
    this.hostName,
    this.id,
    this.instanceCode,
    this.ipAddressHash,
    this.ipAddressMasked,
    this.lastHeartbeatAt,
    this.metadata,
    this.nodeName,
    this.orchestrator,
    this.organizationId,
    this.podName,
    this.region,
    this.runtimeType_,
    this.startedAt,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version,
    this.versionName
  });

  factory OpsGatewayInstanceRecord.fromJson(Map<String, dynamic> json) {
    return OpsGatewayInstanceRecord(
      cell: json['cell']?.toString(),
      configHash: json['config_hash']?.toString(),
      containerIdHash: json['container_id_hash']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      deploymentMode: json['deployment_mode']?.toString(),
      desktopDeviceHash: json['desktop_device_hash']?.toString(),
      healthStatus: json['health_status']?.toString(),
      hostName: json['host_name']?.toString(),
      id: json['id']?.toString(),
      instanceCode: json['instance_code']?.toString(),
      ipAddressHash: json['ip_address_hash']?.toString(),
      ipAddressMasked: json['ip_address_masked']?.toString(),
      lastHeartbeatAt: json['last_heartbeat_at']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      nodeName: json['node_name']?.toString(),
      orchestrator: json['orchestrator']?.toString(),
      organizationId: json['organization_id']?.toString(),
      podName: json['pod_name']?.toString(),
      region: json['region']?.toString(),
      runtimeType_: json['runtime_type']?.toString(),
      startedAt: json['started_at']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      versionName: json['version_name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cell': cell,
      'config_hash': configHash,
      'container_id_hash': containerIdHash,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'deployment_mode': deploymentMode,
      'desktop_device_hash': desktopDeviceHash,
      'health_status': healthStatus,
      'host_name': hostName,
      'id': id,
      'instance_code': instanceCode,
      'ip_address_hash': ipAddressHash,
      'ip_address_masked': ipAddressMasked,
      'last_heartbeat_at': lastHeartbeatAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'node_name': nodeName,
      'orchestrator': orchestrator,
      'organization_id': organizationId,
      'pod_name': podName,
      'region': region,
      'runtime_type': runtimeType_,
      'started_at': startedAt,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
      'version_name': versionName,
    };
  }
}

class OpsInboxEventRecord {
  final String? consumerName;
  final String? createdAt;
  final String? eventType;
  final int? eventVersion;
  final String? failureReason;
  final String? id;
  final bool? legalHold;
  final String? messageId;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? processStatus;
  final String? processedAt;
  final String? requestId;
  final String? retentionUntil;
  final int? retryCount;
  final String? sourceSystem;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userId;
  final String? uuid;

  OpsInboxEventRecord({
    this.consumerName,
    this.createdAt,
    this.eventType,
    this.eventVersion,
    this.failureReason,
    this.id,
    this.legalHold,
    this.messageId,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.processStatus,
    this.processedAt,
    this.requestId,
    this.retentionUntil,
    this.retryCount,
    this.sourceSystem,
    this.status,
    this.tenantId,
    this.traceId,
    this.userId,
    this.uuid
  });

  factory OpsInboxEventRecord.fromJson(Map<String, dynamic> json) {
    return OpsInboxEventRecord(
      consumerName: json['consumer_name']?.toString(),
      createdAt: json['created_at']?.toString(),
      eventType: json['event_type']?.toString(),
      eventVersion: json['event_version'] is int ? json['event_version'] : null,
      failureReason: json['failure_reason']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      messageId: json['message_id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      processStatus: json['process_status']?.toString(),
      processedAt: json['processed_at']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      retryCount: json['retry_count'] is int ? json['retry_count'] : null,
      sourceSystem: json['source_system']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'consumer_name': consumerName,
      'created_at': createdAt,
      'event_type': eventType,
      'event_version': eventVersion,
      'failure_reason': failureReason,
      'id': id,
      'legal_hold': legalHold,
      'message_id': messageId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'process_status': processStatus,
      'processed_at': processedAt,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'retry_count': retryCount,
      'source_system': sourceSystem,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class OpsJobExecutionRecord {
  final String? createdAt;
  final String? durationMs;
  final String? endedAt;
  final String? executionStatus;
  final String? failureCount;
  final String? failureReason;
  final String? id;
  final String? jobName;
  final String? jobType;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final Map<String, dynamic>? payload;
  final String? payloadHash;
  final String? processedCount;
  final String? requestId;
  final String? retentionUntil;
  final String? startedAt;
  final String? status;
  final String? successCount;
  final String? tenantId;
  final String? traceId;
  final String? triggerType;
  final String? userId;
  final String? uuid;

  OpsJobExecutionRecord({
    this.createdAt,
    this.durationMs,
    this.endedAt,
    this.executionStatus,
    this.failureCount,
    this.failureReason,
    this.id,
    this.jobName,
    this.jobType,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payload,
    this.payloadHash,
    this.processedCount,
    this.requestId,
    this.retentionUntil,
    this.startedAt,
    this.status,
    this.successCount,
    this.tenantId,
    this.traceId,
    this.triggerType,
    this.userId,
    this.uuid
  });

  factory OpsJobExecutionRecord.fromJson(Map<String, dynamic> json) {
    return OpsJobExecutionRecord(
      createdAt: json['created_at']?.toString(),
      durationMs: json['duration_ms']?.toString(),
      endedAt: json['ended_at']?.toString(),
      executionStatus: json['execution_status']?.toString(),
      failureCount: json['failure_count']?.toString(),
      failureReason: json['failure_reason']?.toString(),
      id: json['id']?.toString(),
      jobName: json['job_name']?.toString(),
      jobType: json['job_type']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payload: (() {
        final map = _sdkworkAsMap(json['payload']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      payloadHash: json['payload_hash']?.toString(),
      processedCount: json['processed_count']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      startedAt: json['started_at']?.toString(),
      status: json['status']?.toString(),
      successCount: json['success_count']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      triggerType: json['trigger_type']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'duration_ms': durationMs,
      'ended_at': endedAt,
      'execution_status': executionStatus,
      'failure_count': failureCount,
      'failure_reason': failureReason,
      'id': id,
      'job_name': jobName,
      'job_type': jobType,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload': payload?.map((key, item) => MapEntry(key, item)),
      'payload_hash': payloadHash,
      'processed_count': processedCount,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'started_at': startedAt,
      'status': status,
      'success_count': successCount,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'trigger_type': triggerType,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class OpsMetricSnapshotRecord {
  final String? createdAt;
  final String? dimensionKey;
  final String? dimensionValue;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? metricName;
  final String? metricPeriod;
  final String? metricScope;
  final String? metricUnit;
  final String? metricValue;
  final String? organizationId;
  final Map<String, dynamic>? payload;
  final String? periodEnd;
  final String? periodStart;
  final String? rebuildVersion;
  final String? sourceId;
  final String? sourceType;
  final String? sourceVersion;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;

  OpsMetricSnapshotRecord({
    this.createdAt,
    this.dimensionKey,
    this.dimensionValue,
    this.id,
    this.metadata,
    this.metricName,
    this.metricPeriod,
    this.metricScope,
    this.metricUnit,
    this.metricValue,
    this.organizationId,
    this.payload,
    this.periodEnd,
    this.periodStart,
    this.rebuildVersion,
    this.sourceId,
    this.sourceType,
    this.sourceVersion,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.uuid
  });

  factory OpsMetricSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return OpsMetricSnapshotRecord(
      createdAt: json['created_at']?.toString(),
      dimensionKey: json['dimension_key']?.toString(),
      dimensionValue: json['dimension_value']?.toString(),
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      metricName: json['metric_name']?.toString(),
      metricPeriod: json['metric_period']?.toString(),
      metricScope: json['metric_scope']?.toString(),
      metricUnit: json['metric_unit']?.toString(),
      metricValue: json['metric_value']?.toString(),
      organizationId: json['organization_id']?.toString(),
      payload: (() {
        final map = _sdkworkAsMap(json['payload']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      periodEnd: json['period_end']?.toString(),
      periodStart: json['period_start']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'dimension_key': dimensionKey,
      'dimension_value': dimensionValue,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'metric_name': metricName,
      'metric_period': metricPeriod,
      'metric_scope': metricScope,
      'metric_unit': metricUnit,
      'metric_value': metricValue,
      'organization_id': organizationId,
      'payload': payload?.map((key, item) => MapEntry(key, item)),
      'period_end': periodEnd,
      'period_start': periodStart,
      'rebuild_version': rebuildVersion,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
    };
  }
}

class OpsNotificationDeliveryRecord {
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? deliveredAt;
  final String? deliveryChannel;
  final String? deliveryStatus;
  final String? failureCode;
  final String? id;
  final String? messageId;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? ownerId;
  final String? ownerType;
  final String? readAt;
  final int? retryCount;
  final String? status;
  final String? tenantId;
  final String? updatedAt;
  final String? userId;
  final String? uuid;
  final String? version;

  OpsNotificationDeliveryRecord({
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.deliveredAt,
    this.deliveryChannel,
    this.deliveryStatus,
    this.failureCode,
    this.id,
    this.messageId,
    this.metadata,
    this.organizationId,
    this.ownerId,
    this.ownerType,
    this.readAt,
    this.retryCount,
    this.status,
    this.tenantId,
    this.updatedAt,
    this.userId,
    this.uuid,
    this.version
  });

  factory OpsNotificationDeliveryRecord.fromJson(Map<String, dynamic> json) {
    return OpsNotificationDeliveryRecord(
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      deliveredAt: json['delivered_at']?.toString(),
      deliveryChannel: json['delivery_channel']?.toString(),
      deliveryStatus: json['delivery_status']?.toString(),
      failureCode: json['failure_code']?.toString(),
      id: json['id']?.toString(),
      messageId: json['message_id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      ownerId: json['owner_id']?.toString(),
      ownerType: json['owner_type']?.toString(),
      readAt: json['read_at']?.toString(),
      retryCount: json['retry_count'] is int ? json['retry_count'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'delivered_at': deliveredAt,
      'delivery_channel': deliveryChannel,
      'delivery_status': deliveryStatus,
      'failure_code': failureCode,
      'id': id,
      'message_id': messageId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'owner_id': ownerId,
      'owner_type': ownerType,
      'read_at': readAt,
      'retry_count': retryCount,
      'status': status,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'user_id': userId,
      'uuid': uuid,
      'version': version,
    };
  }
}

class OpsNotificationMessageRecord {
  final String? actionUrl;
  final String? content;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? expireAt;
  final String? id;
  final String? messageCode;
  final String? messageType;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? publishedAt;
  final String? severity;
  final String? status;
  final String? summary;
  final String? targetOwnerId;
  final String? targetOwnerType;
  final String? targetScope;
  final String? targetUserId;
  final String? tenantId;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  OpsNotificationMessageRecord({
    this.actionUrl,
    this.content,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.expireAt,
    this.id,
    this.messageCode,
    this.messageType,
    this.metadata,
    this.organizationId,
    this.publishedAt,
    this.severity,
    this.status,
    this.summary,
    this.targetOwnerId,
    this.targetOwnerType,
    this.targetScope,
    this.targetUserId,
    this.tenantId,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory OpsNotificationMessageRecord.fromJson(Map<String, dynamic> json) {
    return OpsNotificationMessageRecord(
      actionUrl: json['action_url']?.toString(),
      content: json['content']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      expireAt: json['expire_at']?.toString(),
      id: json['id']?.toString(),
      messageCode: json['message_code']?.toString(),
      messageType: json['message_type']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      publishedAt: json['published_at']?.toString(),
      severity: json['severity']?.toString(),
      status: json['status']?.toString(),
      summary: json['summary']?.toString(),
      targetOwnerId: json['target_owner_id']?.toString(),
      targetOwnerType: json['target_owner_type']?.toString(),
      targetScope: json['target_scope']?.toString(),
      targetUserId: json['target_user_id']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'action_url': actionUrl,
      'content': content,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'expire_at': expireAt,
      'id': id,
      'message_code': messageCode,
      'message_type': messageType,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'published_at': publishedAt,
      'severity': severity,
      'status': status,
      'summary': summary,
      'target_owner_id': targetOwnerId,
      'target_owner_type': targetOwnerType,
      'target_scope': targetScope,
      'target_user_id': targetUserId,
      'tenant_id': tenantId,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class OpsOutboxEventRecord {
  final String? aggregateId;
  final String? aggregateType;
  final String? aggregateUuid;
  final String? createdAt;
  final String? eventId;
  final Map<String, dynamic>? eventPayload;
  final String? eventType;
  final int? eventVersion;
  final String? failureReason;
  final Map<String, dynamic>? headers;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? nextRetryAt;
  final String? organizationId;
  final String? payloadHash;
  final String? publishStatus;
  final String? publishedAt;
  final String? requestId;
  final String? retentionUntil;
  final int? retryCount;
  final String? status;
  final String? tenantId;
  final String? traceId;
  final String? userId;
  final String? uuid;

  OpsOutboxEventRecord({
    this.aggregateId,
    this.aggregateType,
    this.aggregateUuid,
    this.createdAt,
    this.eventId,
    this.eventPayload,
    this.eventType,
    this.eventVersion,
    this.failureReason,
    this.headers,
    this.id,
    this.legalHold,
    this.metadata,
    this.nextRetryAt,
    this.organizationId,
    this.payloadHash,
    this.publishStatus,
    this.publishedAt,
    this.requestId,
    this.retentionUntil,
    this.retryCount,
    this.status,
    this.tenantId,
    this.traceId,
    this.userId,
    this.uuid
  });

  factory OpsOutboxEventRecord.fromJson(Map<String, dynamic> json) {
    return OpsOutboxEventRecord(
      aggregateId: json['aggregate_id']?.toString(),
      aggregateType: json['aggregate_type']?.toString(),
      aggregateUuid: json['aggregate_uuid']?.toString(),
      createdAt: json['created_at']?.toString(),
      eventId: json['event_id']?.toString(),
      eventPayload: (() {
        final map = _sdkworkAsMap(json['event_payload']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      eventType: json['event_type']?.toString(),
      eventVersion: json['event_version'] is int ? json['event_version'] : null,
      failureReason: json['failure_reason']?.toString(),
      headers: (() {
        final map = _sdkworkAsMap(json['headers']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      nextRetryAt: json['next_retry_at']?.toString(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      publishStatus: json['publish_status']?.toString(),
      publishedAt: json['published_at']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      retryCount: json['retry_count'] is int ? json['retry_count'] : null,
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'aggregate_id': aggregateId,
      'aggregate_type': aggregateType,
      'aggregate_uuid': aggregateUuid,
      'created_at': createdAt,
      'event_id': eventId,
      'event_payload': eventPayload?.map((key, item) => MapEntry(key, item)),
      'event_type': eventType,
      'event_version': eventVersion,
      'failure_reason': failureReason,
      'headers': headers?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'next_retry_at': nextRetryAt,
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'publish_status': publishStatus,
      'published_at': publishedAt,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'retry_count': retryCount,
      'status': status,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class OpsReferralStatSnapshotRecord {
  final String? createdAt;
  final String? currency;
  final String? directInvitedCount;
  final String? id;
  final String? invitationCode;
  final String? invitationCodeId;
  final String? inviteLink;
  final String? inviterEmailSnapshot;
  final String? inviterNameSnapshot;
  final String? inviterUserId;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? paidInviteeCount;
  final String? periodEnd;
  final String? periodStart;
  final String? rebuildVersion;
  final String? rewardAwardedAmount;
  final String? rewardPendingAmount;
  final String? secondaryInvitedCount;
  final String? snapshotAt;
  final String? snapshotPeriod;
  final String? sourceId;
  final String? sourceType;
  final String? sourceVersion;
  final String? status;
  final String? tenantId;
  final String? totalInvitedCount;
  final String? totalRevenueAmount;
  final String? updatedAt;
  final String? uuid;

  OpsReferralStatSnapshotRecord({
    this.createdAt,
    this.currency,
    this.directInvitedCount,
    this.id,
    this.invitationCode,
    this.invitationCodeId,
    this.inviteLink,
    this.inviterEmailSnapshot,
    this.inviterNameSnapshot,
    this.inviterUserId,
    this.metadata,
    this.organizationId,
    this.paidInviteeCount,
    this.periodEnd,
    this.periodStart,
    this.rebuildVersion,
    this.rewardAwardedAmount,
    this.rewardPendingAmount,
    this.secondaryInvitedCount,
    this.snapshotAt,
    this.snapshotPeriod,
    this.sourceId,
    this.sourceType,
    this.sourceVersion,
    this.status,
    this.tenantId,
    this.totalInvitedCount,
    this.totalRevenueAmount,
    this.updatedAt,
    this.uuid
  });

  factory OpsReferralStatSnapshotRecord.fromJson(Map<String, dynamic> json) {
    return OpsReferralStatSnapshotRecord(
      createdAt: json['created_at']?.toString(),
      currency: json['currency']?.toString(),
      directInvitedCount: json['direct_invited_count']?.toString(),
      id: json['id']?.toString(),
      invitationCode: json['invitation_code']?.toString(),
      invitationCodeId: json['invitation_code_id']?.toString(),
      inviteLink: json['invite_link']?.toString(),
      inviterEmailSnapshot: json['inviter_email_snapshot']?.toString(),
      inviterNameSnapshot: json['inviter_name_snapshot']?.toString(),
      inviterUserId: json['inviter_user_id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      paidInviteeCount: json['paid_invitee_count']?.toString(),
      periodEnd: json['period_end']?.toString(),
      periodStart: json['period_start']?.toString(),
      rebuildVersion: json['rebuild_version']?.toString(),
      rewardAwardedAmount: json['reward_awarded_amount']?.toString(),
      rewardPendingAmount: json['reward_pending_amount']?.toString(),
      secondaryInvitedCount: json['secondary_invited_count']?.toString(),
      snapshotAt: json['snapshot_at']?.toString(),
      snapshotPeriod: json['snapshot_period']?.toString(),
      sourceId: json['source_id']?.toString(),
      sourceType: json['source_type']?.toString(),
      sourceVersion: json['source_version']?.toString(),
      status: json['status']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      totalInvitedCount: json['total_invited_count']?.toString(),
      totalRevenueAmount: json['total_revenue_amount']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'created_at': createdAt,
      'currency': currency,
      'direct_invited_count': directInvitedCount,
      'id': id,
      'invitation_code': invitationCode,
      'invitation_code_id': invitationCodeId,
      'invite_link': inviteLink,
      'inviter_email_snapshot': inviterEmailSnapshot,
      'inviter_name_snapshot': inviterNameSnapshot,
      'inviter_user_id': inviterUserId,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'paid_invitee_count': paidInviteeCount,
      'period_end': periodEnd,
      'period_start': periodStart,
      'rebuild_version': rebuildVersion,
      'reward_awarded_amount': rewardAwardedAmount,
      'reward_pending_amount': rewardPendingAmount,
      'secondary_invited_count': secondaryInvitedCount,
      'snapshot_at': snapshotAt,
      'snapshot_period': snapshotPeriod,
      'source_id': sourceId,
      'source_type': sourceType,
      'source_version': sourceVersion,
      'status': status,
      'tenant_id': tenantId,
      'total_invited_count': totalInvitedCount,
      'total_revenue_amount': totalRevenueAmount,
      'updated_at': updatedAt,
      'uuid': uuid,
    };
  }
}

class PasswordResetRequestsCreateResult {
  final String? code;
  final IamPasswordResetRequestResponse? data;
  final String? message;
  final String? msg;

  PasswordResetRequestsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PasswordResetRequestsCreateResult.fromJson(Map<String, dynamic> json) {
    return PasswordResetRequestsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamPasswordResetRequestResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PasswordResetsCreateResult {
  final String? code;
  final NoData? data;
  final String? message;
  final String? msg;

  PasswordResetsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PasswordResetsCreateResult.fromJson(Map<String, dynamic> json) {
    return PasswordResetsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NoData.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PaymentsCheckoutRetrieveResult {
  final String? code;
  final CheckoutStatusResponse? data;
  final String? message;
  final String? msg;

  PaymentsCheckoutRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PaymentsCheckoutRetrieveResult.fromJson(Map<String, dynamic> json) {
    return PaymentsCheckoutRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CheckoutStatusResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PaymentsRecordsListResult {
  final String? code;
  final List<BillingRechargeHistoryItem>? data;
  final String? message;
  final String? msg;

  PaymentsRecordsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PaymentsRecordsListResult.fromJson(Map<String, dynamic> json) {
    return PaymentsRecordsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : BillingRechargeHistoryItem.fromJson(map);
      })())
            .whereType<BillingRechargeHistoryItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class PaymentsRecordsRetrieveResult {
  final String? code;
  final BillingRechargeHistoryItem? data;
  final String? message;
  final String? msg;

  PaymentsRecordsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PaymentsRecordsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return PaymentsRecordsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : BillingRechargeHistoryItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PlusAccountExchangeConfigRecord {


  PlusAccountExchangeConfigRecord();

  factory PlusAccountExchangeConfigRecord.fromJson(Map<String, dynamic> json) {
    return PlusAccountExchangeConfigRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusAccountHistoryRecord {


  PlusAccountHistoryRecord();

  factory PlusAccountHistoryRecord.fromJson(Map<String, dynamic> json) {
    return PlusAccountHistoryRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusAccountRecord {


  PlusAccountRecord();

  factory PlusAccountRecord.fromJson(Map<String, dynamic> json) {
    return PlusAccountRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusAgentSkillPackageRecord {
  final String? categoryId;
  final String? coverImage;
  final String? description;
  final String? icon;
  final String? latestPublishedAt;
  final String? summary;
  final String? userId;

  PlusAgentSkillPackageRecord({
    this.categoryId,
    this.coverImage,
    this.description,
    this.icon,
    this.latestPublishedAt,
    this.summary,
    this.userId
  });

  factory PlusAgentSkillPackageRecord.fromJson(Map<String, dynamic> json) {
    return PlusAgentSkillPackageRecord(
      categoryId: json['category_id']?.toString(),
      coverImage: json['cover_image']?.toString(),
      description: json['description']?.toString(),
      icon: json['icon']?.toString(),
      latestPublishedAt: json['latest_published_at']?.toString(),
      summary: json['summary']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category_id': categoryId,
      'cover_image': coverImage,
      'description': description,
      'icon': icon,
      'latest_published_at': latestPublishedAt,
      'summary': summary,
      'user_id': userId,
    };
  }
}

class PlusAgentSkillRecord {
  final String? categoryId;
  final String? coverImage;
  final String? description;
  final String? documentationUrl;
  final String? entrypoint;
  final String? homepageUrl;
  final String? icon;
  final String? latestPublishedAt;
  final String? licenseName;
  final String? manifestUrl;
  final String? packageId;
  final String? price;
  final String? provider;
  final String? repositoryUrl;
  final String? reviewComment;
  final String? reviewedAt;
  final String? reviewedBy;
  final String? runtime;
  final String? summary;
  final String? userId;
  final String? version;
  final String? versionName;

  PlusAgentSkillRecord({
    this.categoryId,
    this.coverImage,
    this.description,
    this.documentationUrl,
    this.entrypoint,
    this.homepageUrl,
    this.icon,
    this.latestPublishedAt,
    this.licenseName,
    this.manifestUrl,
    this.packageId,
    this.price,
    this.provider,
    this.repositoryUrl,
    this.reviewComment,
    this.reviewedAt,
    this.reviewedBy,
    this.runtime,
    this.summary,
    this.userId,
    this.version,
    this.versionName
  });

  factory PlusAgentSkillRecord.fromJson(Map<String, dynamic> json) {
    return PlusAgentSkillRecord(
      categoryId: json['category_id']?.toString(),
      coverImage: json['cover_image']?.toString(),
      description: json['description']?.toString(),
      documentationUrl: json['documentation_url']?.toString(),
      entrypoint: json['entrypoint']?.toString(),
      homepageUrl: json['homepage_url']?.toString(),
      icon: json['icon']?.toString(),
      latestPublishedAt: json['latest_published_at']?.toString(),
      licenseName: json['license_name']?.toString(),
      manifestUrl: json['manifest_url']?.toString(),
      packageId: json['package_id']?.toString(),
      price: json['price']?.toString(),
      provider: json['provider']?.toString(),
      repositoryUrl: json['repository_url']?.toString(),
      reviewComment: json['review_comment']?.toString(),
      reviewedAt: json['reviewed_at']?.toString(),
      reviewedBy: json['reviewed_by']?.toString(),
      runtime: json['runtime']?.toString(),
      summary: json['summary']?.toString(),
      userId: json['user_id']?.toString(),
      version: json['version']?.toString(),
      versionName: json['version_name']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category_id': categoryId,
      'cover_image': coverImage,
      'description': description,
      'documentation_url': documentationUrl,
      'entrypoint': entrypoint,
      'homepage_url': homepageUrl,
      'icon': icon,
      'latest_published_at': latestPublishedAt,
      'license_name': licenseName,
      'manifest_url': manifestUrl,
      'package_id': packageId,
      'price': price,
      'provider': provider,
      'repository_url': repositoryUrl,
      'review_comment': reviewComment,
      'reviewed_at': reviewedAt,
      'reviewed_by': reviewedBy,
      'runtime': runtime,
      'summary': summary,
      'user_id': userId,
      'version': version,
      'version_name': versionName,
    };
  }
}

class PlusApiKeyRecord {


  PlusApiKeyRecord();

  factory PlusApiKeyRecord.fromJson(Map<String, dynamic> json) {
    return PlusApiKeyRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusApiResult {
  final String? code;
  final NoData? data;
  final String? message;
  final String? msg;

  PlusApiResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PlusApiResult.fromJson(Map<String, dynamic> json) {
    return PlusApiResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NoData.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PlusAppRecord {
  final String? accessUrl;
  final String? appType;
  final String? bundleId;
  final String? description;
  final String? downloadUrl;
  final Map<String, dynamic>? icon;
  final String? iconUrl;
  final Map<String, dynamic>? installConfig;
  final Map<String, dynamic>? installPlatforms;
  final Map<String, dynamic>? installSkill;
  final String? packageName;
  final Map<String, dynamic>? platforms;
  final String? projectId;
  final Map<String, dynamic>? releaseNotes;
  final Map<String, dynamic>? resourceList;
  final String? storeUrl;
  final String? userId;
  final String? version;

  PlusAppRecord({
    this.accessUrl,
    this.appType,
    this.bundleId,
    this.description,
    this.downloadUrl,
    this.icon,
    this.iconUrl,
    this.installConfig,
    this.installPlatforms,
    this.installSkill,
    this.packageName,
    this.platforms,
    this.projectId,
    this.releaseNotes,
    this.resourceList,
    this.storeUrl,
    this.userId,
    this.version
  });

  factory PlusAppRecord.fromJson(Map<String, dynamic> json) {
    return PlusAppRecord(
      accessUrl: json['access_url']?.toString(),
      appType: json['app_type']?.toString(),
      bundleId: json['bundle_id']?.toString(),
      description: json['description']?.toString(),
      downloadUrl: json['download_url']?.toString(),
      icon: (() {
        final map = _sdkworkAsMap(json['icon']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      iconUrl: json['icon_url']?.toString(),
      installConfig: (() {
        final map = _sdkworkAsMap(json['install_config']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      installPlatforms: (() {
        final map = _sdkworkAsMap(json['install_platforms']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      installSkill: (() {
        final map = _sdkworkAsMap(json['install_skill']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      packageName: json['package_name']?.toString(),
      platforms: (() {
        final map = _sdkworkAsMap(json['platforms']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      projectId: json['project_id']?.toString(),
      releaseNotes: (() {
        final map = _sdkworkAsMap(json['release_notes']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      resourceList: (() {
        final map = _sdkworkAsMap(json['resource_list']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      storeUrl: json['store_url']?.toString(),
      userId: json['user_id']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'access_url': accessUrl,
      'app_type': appType,
      'bundle_id': bundleId,
      'description': description,
      'download_url': downloadUrl,
      'icon': icon?.map((key, item) => MapEntry(key, item)),
      'icon_url': iconUrl,
      'install_config': installConfig?.map((key, item) => MapEntry(key, item)),
      'install_platforms': installPlatforms?.map((key, item) => MapEntry(key, item)),
      'install_skill': installSkill?.map((key, item) => MapEntry(key, item)),
      'package_name': packageName,
      'platforms': platforms?.map((key, item) => MapEntry(key, item)),
      'project_id': projectId,
      'release_notes': releaseNotes?.map((key, item) => MapEntry(key, item)),
      'resource_list': resourceList?.map((key, item) => MapEntry(key, item)),
      'store_url': storeUrl,
      'user_id': userId,
      'version': version,
    };
  }
}

class PlusCardRecord {


  PlusCardRecord();

  factory PlusCardRecord.fromJson(Map<String, dynamic> json) {
    return PlusCardRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusCardTemplateRecord {


  PlusCardTemplateRecord();

  factory PlusCardTemplateRecord.fromJson(Map<String, dynamic> json) {
    return PlusCardTemplateRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusCategoryRecord {
  final String? code;
  final String? description;
  final String? groupName;
  final String? icon;
  final String? parentId;
  final String? path;
  final String? shopId;

  PlusCategoryRecord({
    this.code,
    this.description,
    this.groupName,
    this.icon,
    this.parentId,
    this.path,
    this.shopId
  });

  factory PlusCategoryRecord.fromJson(Map<String, dynamic> json) {
    return PlusCategoryRecord(
      code: json['code']?.toString(),
      description: json['description']?.toString(),
      groupName: json['group_name']?.toString(),
      icon: json['icon']?.toString(),
      parentId: json['parent_id']?.toString(),
      path: json['path']?.toString(),
      shopId: json['shop_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'description': description,
      'group_name': groupName,
      'icon': icon,
      'parent_id': parentId,
      'path': path,
      'shop_id': shopId,
    };
  }
}

class PlusChannelAccountRecord {


  PlusChannelAccountRecord();

  factory PlusChannelAccountRecord.fromJson(Map<String, dynamic> json) {
    return PlusChannelAccountRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusChannelProxyRecord {


  PlusChannelProxyRecord();

  factory PlusChannelProxyRecord.fromJson(Map<String, dynamic> json) {
    return PlusChannelProxyRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusChannelRecord {


  PlusChannelRecord();

  factory PlusChannelRecord.fromJson(Map<String, dynamic> json) {
    return PlusChannelRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusCommentsRecord {
  final Map<String, dynamic>? author;
  final String? deviceInfo;
  final String? ipAddress;
  final String? parentId;
  final String? path;
  final String? userId;

  PlusCommentsRecord({
    this.author,
    this.deviceInfo,
    this.ipAddress,
    this.parentId,
    this.path,
    this.userId
  });

  factory PlusCommentsRecord.fromJson(Map<String, dynamic> json) {
    return PlusCommentsRecord(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      deviceInfo: json['device_info']?.toString(),
      ipAddress: json['ip_address']?.toString(),
      parentId: json['parent_id']?.toString(),
      path: json['path']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author?.map((key, item) => MapEntry(key, item)),
      'device_info': deviceInfo,
      'ip_address': ipAddress,
      'parent_id': parentId,
      'path': path,
      'user_id': userId,
    };
  }
}

class PlusContentVoteRecord {
  final String? clientIp;
  final String? deviceInfo;
  final String? source;
  final String? userId;

  PlusContentVoteRecord({
    this.clientIp,
    this.deviceInfo,
    this.source,
    this.userId
  });

  factory PlusContentVoteRecord.fromJson(Map<String, dynamic> json) {
    return PlusContentVoteRecord(
      clientIp: json['client_ip']?.toString(),
      deviceInfo: json['device_info']?.toString(),
      source: json['source']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'client_ip': clientIp,
      'device_info': deviceInfo,
      'source': source,
      'user_id': userId,
    };
  }
}

class PlusCouponRecord {


  PlusCouponRecord();

  factory PlusCouponRecord.fromJson(Map<String, dynamic> json) {
    return PlusCouponRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusCouponTemplateRecord {


  PlusCouponTemplateRecord();

  factory PlusCouponTemplateRecord.fromJson(Map<String, dynamic> json) {
    return PlusCouponTemplateRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusCurrencyRecord {


  PlusCurrencyRecord();

  factory PlusCurrencyRecord.fromJson(Map<String, dynamic> json) {
    return PlusCurrencyRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusDepartmentRecord {


  PlusDepartmentRecord();

  factory PlusDepartmentRecord.fromJson(Map<String, dynamic> json) {
    return PlusDepartmentRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusExchangeRateRecord {


  PlusExchangeRateRecord();

  factory PlusExchangeRateRecord.fromJson(Map<String, dynamic> json) {
    return PlusExchangeRateRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusFavoriteRecord {
  final String? folderId;
  final Map<String, dynamic>? image;
  final String? lastViewedAt;
  final String? remark;
  final String? tags;
  final String? title;
  final String? userId;

  PlusFavoriteRecord({
    this.folderId,
    this.image,
    this.lastViewedAt,
    this.remark,
    this.tags,
    this.title,
    this.userId
  });

  factory PlusFavoriteRecord.fromJson(Map<String, dynamic> json) {
    return PlusFavoriteRecord(
      folderId: json['folder_id']?.toString(),
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      lastViewedAt: json['last_viewed_at']?.toString(),
      remark: json['remark']?.toString(),
      tags: json['tags']?.toString(),
      title: json['title']?.toString(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'folder_id': folderId,
      'image': image?.map((key, item) => MapEntry(key, item)),
      'last_viewed_at': lastViewedAt,
      'remark': remark,
      'tags': tags,
      'title': title,
      'user_id': userId,
    };
  }
}

class PlusFeedsRecord {
  final Map<String, dynamic>? author;
  final Map<String, dynamic>? coverImages;
  final String? publishTime;
  final Map<String, dynamic>? resourceList;
  final String? source;
  final String? sourceUrl;
  final String? summary;
  final Map<String, dynamic>? tags;
  final String? userId;

  PlusFeedsRecord({
    this.author,
    this.coverImages,
    this.publishTime,
    this.resourceList,
    this.source,
    this.sourceUrl,
    this.summary,
    this.tags,
    this.userId
  });

  factory PlusFeedsRecord.fromJson(Map<String, dynamic> json) {
    return PlusFeedsRecord(
      author: (() {
        final map = _sdkworkAsMap(json['author']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      coverImages: (() {
        final map = _sdkworkAsMap(json['cover_images']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      publishTime: json['publish_time']?.toString(),
      resourceList: (() {
        final map = _sdkworkAsMap(json['resource_list']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      source: json['source']?.toString(),
      sourceUrl: json['source_url']?.toString(),
      summary: json['summary']?.toString(),
      tags: (() {
        final map = _sdkworkAsMap(json['tags']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      userId: json['user_id']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'author': author?.map((key, item) => MapEntry(key, item)),
      'cover_images': coverImages?.map((key, item) => MapEntry(key, item)),
      'publish_time': publishTime,
      'resource_list': resourceList?.map((key, item) => MapEntry(key, item)),
      'source': source,
      'source_url': sourceUrl,
      'summary': summary,
      'tags': tags?.map((key, item) => MapEntry(key, item)),
      'user_id': userId,
    };
  }
}

class PlusInvitationCodeRecord {


  PlusInvitationCodeRecord();

  factory PlusInvitationCodeRecord.fromJson(Map<String, dynamic> json) {
    return PlusInvitationCodeRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusInvitationRelationRecord {


  PlusInvitationRelationRecord();

  factory PlusInvitationRelationRecord.fromJson(Map<String, dynamic> json) {
    return PlusInvitationRelationRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusInvoiceItemRecord {


  PlusInvoiceItemRecord();

  factory PlusInvoiceItemRecord.fromJson(Map<String, dynamic> json) {
    return PlusInvoiceItemRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusInvoiceRecord {


  PlusInvoiceRecord();

  factory PlusInvoiceRecord.fromJson(Map<String, dynamic> json) {
    return PlusInvoiceRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusInvoiceRecordRecord {


  PlusInvoiceRecordRecord();

  factory PlusInvoiceRecordRecord.fromJson(Map<String, dynamic> json) {
    return PlusInvoiceRecordRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusLedgerBridgeRecord {


  PlusLedgerBridgeRecord();

  factory PlusLedgerBridgeRecord.fromJson(Map<String, dynamic> json) {
    return PlusLedgerBridgeRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusMemberCardRecord {


  PlusMemberCardRecord();

  factory PlusMemberCardRecord.fromJson(Map<String, dynamic> json) {
    return PlusMemberCardRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusMemberLevelRecord {


  PlusMemberLevelRecord();

  factory PlusMemberLevelRecord.fromJson(Map<String, dynamic> json) {
    return PlusMemberLevelRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusOauthAccountRecord {


  PlusOauthAccountRecord();

  factory PlusOauthAccountRecord.fromJson(Map<String, dynamic> json) {
    return PlusOauthAccountRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusOrderDispatchRuleRecord {


  PlusOrderDispatchRuleRecord();

  factory PlusOrderDispatchRuleRecord.fromJson(Map<String, dynamic> json) {
    return PlusOrderDispatchRuleRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusOrderItemRecord {


  PlusOrderItemRecord();

  factory PlusOrderItemRecord.fromJson(Map<String, dynamic> json) {
    return PlusOrderItemRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusOrderRecord {


  PlusOrderRecord();

  factory PlusOrderRecord.fromJson(Map<String, dynamic> json) {
    return PlusOrderRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusOrderWorkerDispatchProfileRecord {


  PlusOrderWorkerDispatchProfileRecord();

  factory PlusOrderWorkerDispatchProfileRecord.fromJson(Map<String, dynamic> json) {
    return PlusOrderWorkerDispatchProfileRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusOrganizationMemberRecord {


  PlusOrganizationMemberRecord();

  factory PlusOrganizationMemberRecord.fromJson(Map<String, dynamic> json) {
    return PlusOrganizationMemberRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusOrganizationRecord {


  PlusOrganizationRecord();

  factory PlusOrganizationRecord.fromJson(Map<String, dynamic> json) {
    return PlusOrganizationRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusPartnerRecord {


  PlusPartnerRecord();

  factory PlusPartnerRecord.fromJson(Map<String, dynamic> json) {
    return PlusPartnerRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusPaymentRecord {


  PlusPaymentRecord();

  factory PlusPaymentRecord.fromJson(Map<String, dynamic> json) {
    return PlusPaymentRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusPaymentWebhookEventRecord {


  PlusPaymentWebhookEventRecord();

  factory PlusPaymentWebhookEventRecord.fromJson(Map<String, dynamic> json) {
    return PlusPaymentWebhookEventRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusPermissionRecord {


  PlusPermissionRecord();

  factory PlusPermissionRecord.fromJson(Map<String, dynamic> json) {
    return PlusPermissionRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusPositionRecord {


  PlusPositionRecord();

  factory PlusPositionRecord.fromJson(Map<String, dynamic> json) {
    return PlusPositionRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusProductRecord {


  PlusProductRecord();

  factory PlusProductRecord.fromJson(Map<String, dynamic> json) {
    return PlusProductRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusRefundRecord {


  PlusRefundRecord();

  factory PlusRefundRecord.fromJson(Map<String, dynamic> json) {
    return PlusRefundRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusRolePermissionRecord {


  PlusRolePermissionRecord();

  factory PlusRolePermissionRecord.fromJson(Map<String, dynamic> json) {
    return PlusRolePermissionRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusRoleRecord {


  PlusRoleRecord();

  factory PlusRoleRecord.fromJson(Map<String, dynamic> json) {
    return PlusRoleRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusShopRecord {


  PlusShopRecord();

  factory PlusShopRecord.fromJson(Map<String, dynamic> json) {
    return PlusShopRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusShoppingCartItemRecord {


  PlusShoppingCartItemRecord();

  factory PlusShoppingCartItemRecord.fromJson(Map<String, dynamic> json) {
    return PlusShoppingCartItemRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusShoppingCartRecord {


  PlusShoppingCartRecord();

  factory PlusShoppingCartRecord.fromJson(Map<String, dynamic> json) {
    return PlusShoppingCartRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusSkuRecord {


  PlusSkuRecord();

  factory PlusSkuRecord.fromJson(Map<String, dynamic> json) {
    return PlusSkuRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusTenantRecord {


  PlusTenantRecord();

  factory PlusTenantRecord.fromJson(Map<String, dynamic> json) {
    return PlusTenantRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusUsageRecordRecord {


  PlusUsageRecordRecord();

  factory PlusUsageRecordRecord.fromJson(Map<String, dynamic> json) {
    return PlusUsageRecordRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusUserAddressRecord {


  PlusUserAddressRecord();

  factory PlusUserAddressRecord.fromJson(Map<String, dynamic> json) {
    return PlusUserAddressRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusUserAgentSkillRecord {
  final String? installedAt;
  final String? lastEnabledAt;
  final String? lastUsedAt;

  PlusUserAgentSkillRecord({
    this.installedAt,
    this.lastEnabledAt,
    this.lastUsedAt
  });

  factory PlusUserAgentSkillRecord.fromJson(Map<String, dynamic> json) {
    return PlusUserAgentSkillRecord(
      installedAt: json['installed_at']?.toString(),
      lastEnabledAt: json['last_enabled_at']?.toString(),
      lastUsedAt: json['last_used_at']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'installed_at': installedAt,
      'last_enabled_at': lastEnabledAt,
      'last_used_at': lastUsedAt,
    };
  }
}

class PlusUserCardRecord {


  PlusUserCardRecord();

  factory PlusUserCardRecord.fromJson(Map<String, dynamic> json) {
    return PlusUserCardRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusUserCouponRecord {


  PlusUserCouponRecord();

  factory PlusUserCouponRecord.fromJson(Map<String, dynamic> json) {
    return PlusUserCouponRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusUserRecord {


  PlusUserRecord();

  factory PlusUserRecord.fromJson(Map<String, dynamic> json) {
    return PlusUserRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusUserRoleRecord {


  PlusUserRoleRecord();

  factory PlusUserRoleRecord.fromJson(Map<String, dynamic> json) {
    return PlusUserRoleRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipBenefitRecord {


  PlusVipBenefitRecord();

  factory PlusVipBenefitRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipBenefitRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipBenefitUsageRecord {


  PlusVipBenefitUsageRecord();

  factory PlusVipBenefitUsageRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipBenefitUsageRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipLevelBenefitRecord {


  PlusVipLevelBenefitRecord();

  factory PlusVipLevelBenefitRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipLevelBenefitRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipLevelRecord {


  PlusVipLevelRecord();

  factory PlusVipLevelRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipLevelRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipPackGroupRecord {


  PlusVipPackGroupRecord();

  factory PlusVipPackGroupRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipPackGroupRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipPackRecord {


  PlusVipPackRecord();

  factory PlusVipPackRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipPackRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipPointChangeRecord {


  PlusVipPointChangeRecord();

  factory PlusVipPointChangeRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipPointChangeRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipRechargeMethodRecord {


  PlusVipRechargeMethodRecord();

  factory PlusVipRechargeMethodRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipRechargeMethodRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipRechargePackRecord {


  PlusVipRechargePackRecord();

  factory PlusVipRechargePackRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipRechargePackRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipRechargeRecord {


  PlusVipRechargeRecord();

  factory PlusVipRechargeRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipRechargeRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PlusVipUserRecord {


  PlusVipUserRecord();

  factory PlusVipUserRecord.fromJson(Map<String, dynamic> json) {
    return PlusVipUserRecord();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{};
  }
}

class PreflightEstimatesCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  PreflightEstimatesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PreflightEstimatesCreateResult.fromJson(Map<String, dynamic> json) {
    return PreflightEstimatesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PreflightPrechecksCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  PreflightPrechecksCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PreflightPrechecksCreateResult.fromJson(Map<String, dynamic> json) {
    return PreflightPrechecksCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PreflightPreholdsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  PreflightPreholdsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PreflightPreholdsCreateResult.fromJson(Map<String, dynamic> json) {
    return PreflightPreholdsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PreflightReleasesCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  PreflightReleasesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PreflightReleasesCreateResult.fromJson(Map<String, dynamic> json) {
    return PreflightReleasesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class PreflightSettlementsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  PreflightSettlementsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory PreflightSettlementsCreateResult.fromJson(Map<String, dynamic> json) {
    return PreflightSettlementsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class ProblemDetail {
  final String? code;
  final String? detail;
  final List<FieldError>? errors;
  final String? instance;
  final int? status;
  final String? title;
  final String? traceId;
  final String? type;

  ProblemDetail({
    this.code,
    this.detail,
    this.errors,
    this.instance,
    this.status,
    this.title,
    this.traceId,
    this.type
  });

  factory ProblemDetail.fromJson(Map<String, dynamic> json) {
    return ProblemDetail(
      code: json['code']?.toString(),
      detail: json['detail']?.toString(),
      errors: (() {
        final list = _sdkworkAsList(json['errors']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : FieldError.fromJson(map);
      })())
            .whereType<FieldError>()
            .toList();
      })(),
      instance: json['instance']?.toString(),
      status: json['status'] is int ? json['status'] : null,
      title: json['title']?.toString(),
      traceId: json['traceId']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'detail': detail,
      'errors': errors?.map((item) => item.toJson()).toList(),
      'instance': instance,
      'status': status,
      'title': title,
      'traceId': traceId,
      'type': type,
    };
  }
}

class ProviderConfig {
  final String? description;
  final String? id;
  final String? integrationType;
  final String? name;
  final String? providerFamily;
  final String? status;
  final String? url;

  ProviderConfig({
    this.description,
    this.id,
    this.integrationType,
    this.name,
    this.providerFamily,
    this.status,
    this.url
  });

  factory ProviderConfig.fromJson(Map<String, dynamic> json) {
    return ProviderConfig(
      description: json['description']?.toString(),
      id: json['id']?.toString(),
      integrationType: json['integrationType']?.toString(),
      name: json['name']?.toString(),
      providerFamily: json['providerFamily']?.toString(),
      status: json['status']?.toString(),
      url: json['url']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'description': description,
      'id': id,
      'integrationType': integrationType,
      'name': name,
      'providerFamily': providerFamily,
      'status': status,
      'url': url,
    };
  }
}

class ProvidersListResult {
  final String? code;
  final ProvidersResponse? data;
  final String? message;
  final String? msg;

  ProvidersListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory ProvidersListResult.fromJson(Map<String, dynamic> json) {
    return ProvidersListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ProvidersResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class ProvidersResponse {
  final List<ProviderConfig>? items;

  ProvidersResponse({
    this.items
  });

  factory ProvidersResponse.fromJson(Map<String, dynamic> json) {
    return ProvidersResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : ProviderConfig.fromJson(map);
      })())
            .whereType<ProviderConfig>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class RankingVendorOption {
  final String? code;
  final String? label;
  final int? modelCount;

  RankingVendorOption({
    this.code,
    this.label,
    this.modelCount
  });

  factory RankingVendorOption.fromJson(Map<String, dynamic> json) {
    return RankingVendorOption(
      code: json['code']?.toString(),
      label: json['label']?.toString(),
      modelCount: json['modelCount'] is int ? json['modelCount'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'label': label,
      'modelCount': modelCount,
    };
  }
}

class RankingVendorOptionsResponse {
  final List<RankingVendorOption>? items;

  RankingVendorOptionsResponse({
    this.items
  });

  factory RankingVendorOptionsResponse.fromJson(Map<String, dynamic> json) {
    return RankingVendorOptionsResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RankingVendorOption.fromJson(map);
      })())
            .whereType<RankingVendorOption>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class RechargePackage {
  final int? bonus;
  final String? id;
  final String? rmb;

  RechargePackage({
    this.bonus,
    this.id,
    this.rmb
  });

  factory RechargePackage.fromJson(Map<String, dynamic> json) {
    return RechargePackage(
      bonus: json['bonus'] is int ? json['bonus'] : null,
      id: json['id']?.toString(),
      rmb: json['rmb']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bonus': bonus,
      'id': id,
      'rmb': rmb,
    };
  }
}

class RedeemCodeRequest {
  final String? code;

  RedeemCodeRequest({
    this.code
  });

  factory RedeemCodeRequest.fromJson(Map<String, dynamic> json) {
    return RedeemCodeRequest(
      code: json['code']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
    };
  }
}

class RedeemCodeResponse {
  final String? amount;
  final int? balance;
  final int? creditedPoints;
  final String? message;

  RedeemCodeResponse({
    this.amount,
    this.balance,
    this.creditedPoints,
    this.message
  });

  factory RedeemCodeResponse.fromJson(Map<String, dynamic> json) {
    return RedeemCodeResponse(
      amount: json['amount']?.toString(),
      balance: json['balance'] is int ? json['balance'] : null,
      creditedPoints: json['creditedPoints'] is int ? json['creditedPoints'] : null,
      message: json['message']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'balance': balance,
      'creditedPoints': creditedPoints,
      'message': message,
    };
  }
}

class RegistrationsCreateResult {
  final String? code;
  final IamSessionResponse? data;
  final String? message;
  final String? msg;

  RegistrationsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RegistrationsCreateResult.fromJson(Map<String, dynamic> json) {
    return RegistrationsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingApiKeysListResult {
  final String? code;
  final RoutingApiKeysResponse? data;
  final String? message;
  final String? msg;

  RoutingApiKeysListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingApiKeysListResult.fromJson(Map<String, dynamic> json) {
    return RoutingApiKeysListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingApiKeysResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingApiKeysResponse {
  final List<Map<String, dynamic>>? items;

  RoutingApiKeysResponse({
    this.items
  });

  factory RoutingApiKeysResponse.fromJson(Map<String, dynamic> json) {
    return RoutingApiKeysResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => _sdkworkAsMap(item))
            .whereType<Map<String, dynamic>>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item).toList(),
    };
  }
}

class RoutingChannelDeleteResponse {
  final bool? deleted;

  RoutingChannelDeleteResponse({
    this.deleted
  });

  factory RoutingChannelDeleteResponse.fromJson(Map<String, dynamic> json) {
    return RoutingChannelDeleteResponse(
      deleted: json['deleted'] is bool ? json['deleted'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'deleted': deleted,
    };
  }
}

class RoutingChannelItem {
  final String? accessType;
  final String? apiKey;
  final String? balance;
  final String? baseUrl;
  final List<String>? capabilities;
  final int? errors;
  final String? id;
  final bool? isMultimodal;
  final String? latency;
  final List<String>? models;
  final String? name;
  final String? protocol;
  final String? provider;
  final String? providerCode;
  final int? rpm;
  final String? status;
  final String? vendor;
  final int? weight;

  RoutingChannelItem({
    this.accessType,
    this.apiKey,
    this.balance,
    this.baseUrl,
    this.capabilities,
    this.errors,
    this.id,
    this.isMultimodal,
    this.latency,
    this.models,
    this.name,
    this.protocol,
    this.provider,
    this.providerCode,
    this.rpm,
    this.status,
    this.vendor,
    this.weight
  });

  factory RoutingChannelItem.fromJson(Map<String, dynamic> json) {
    return RoutingChannelItem(
      accessType: json['accessType']?.toString(),
      apiKey: json['apiKey']?.toString(),
      balance: json['balance']?.toString(),
      baseUrl: json['baseUrl']?.toString(),
      capabilities: (() {
        final list = _sdkworkAsList(json['capabilities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      errors: json['errors'] is int ? json['errors'] : null,
      id: json['id']?.toString(),
      isMultimodal: json['isMultimodal'] is bool ? json['isMultimodal'] : null,
      latency: json['latency']?.toString(),
      models: (() {
        final list = _sdkworkAsList(json['models']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: json['name']?.toString(),
      protocol: json['protocol']?.toString(),
      provider: json['provider']?.toString(),
      providerCode: json['providerCode']?.toString(),
      rpm: json['rpm'] is int ? json['rpm'] : null,
      status: json['status']?.toString(),
      vendor: json['vendor']?.toString(),
      weight: json['weight'] is int ? json['weight'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accessType': accessType,
      'apiKey': apiKey,
      'balance': balance,
      'baseUrl': baseUrl,
      'capabilities': capabilities?.map((item) => item).toList(),
      'errors': errors,
      'id': id,
      'isMultimodal': isMultimodal,
      'latency': latency,
      'models': models?.map((item) => item).toList(),
      'name': name,
      'protocol': protocol,
      'provider': provider,
      'providerCode': providerCode,
      'rpm': rpm,
      'status': status,
      'vendor': vendor,
      'weight': weight,
    };
  }
}

class RoutingChannelMutationResponse {
  final RoutingChannelItem? item;

  RoutingChannelMutationResponse({
    this.item
  });

  factory RoutingChannelMutationResponse.fromJson(Map<String, dynamic> json) {
    return RoutingChannelMutationResponse(
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        return map == null ? null : RoutingChannelItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'item': item?.toJson(),
    };
  }
}

class RoutingChannelTestResponse {
  final String? channelId;
  final RoutingChannelItem? item;
  final String? latency;
  final String? status;
  final bool? success;

  RoutingChannelTestResponse({
    this.channelId,
    this.item,
    this.latency,
    this.status,
    this.success
  });

  factory RoutingChannelTestResponse.fromJson(Map<String, dynamic> json) {
    return RoutingChannelTestResponse(
      channelId: json['channelId']?.toString(),
      item: (() {
        final map = _sdkworkAsMap(json['item']);
        return map == null ? null : RoutingChannelItem.fromJson(map);
      })(),
      latency: json['latency']?.toString(),
      status: json['status']?.toString(),
      success: json['success'] is bool ? json['success'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'channelId': channelId,
      'item': item?.toJson(),
      'latency': latency,
      'status': status,
      'success': success,
    };
  }
}

class RoutingChannelsCreateResult {
  final String? code;
  final RoutingChannelMutationResponse? data;
  final String? message;
  final String? msg;

  RoutingChannelsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingChannelsCreateResult.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingChannelMutationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingChannelsDeleteResult {
  final String? code;
  final RoutingChannelDeleteResponse? data;
  final String? message;
  final String? msg;

  RoutingChannelsDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingChannelsDeleteResult.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsDeleteResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingChannelDeleteResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingChannelsListResult {
  final String? code;
  final RoutingChannelsResponse? data;
  final String? message;
  final String? msg;

  RoutingChannelsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingChannelsListResult.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingChannelsResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingChannelsResponse {
  final List<Map<String, dynamic>>? items;

  RoutingChannelsResponse({
    this.items
  });

  factory RoutingChannelsResponse.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => _sdkworkAsMap(item))
            .whereType<Map<String, dynamic>>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item).toList(),
    };
  }
}

class RoutingChannelsStatusUpdateResult {
  final String? code;
  final RoutingChannelMutationResponse? data;
  final String? message;
  final String? msg;

  RoutingChannelsStatusUpdateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingChannelsStatusUpdateResult.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsStatusUpdateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingChannelMutationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingChannelsUpdateResult {
  final String? code;
  final RoutingChannelMutationResponse? data;
  final String? message;
  final String? msg;

  RoutingChannelsUpdateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingChannelsUpdateResult.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsUpdateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingChannelMutationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingChannelsVerifyResult {
  final String? code;
  final RoutingChannelTestResponse? data;
  final String? message;
  final String? msg;

  RoutingChannelsVerifyResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingChannelsVerifyResult.fromJson(Map<String, dynamic> json) {
    return RoutingChannelsVerifyResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingChannelTestResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingRequestTracesListResult {
  final String? code;
  final RoutingRequestTracesResponse? data;
  final String? message;
  final String? msg;

  RoutingRequestTracesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingRequestTracesListResult.fromJson(Map<String, dynamic> json) {
    return RoutingRequestTracesListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingRequestTracesResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingRequestTracesResponse {
  final List<Map<String, dynamic>>? items;

  RoutingRequestTracesResponse({
    this.items
  });

  factory RoutingRequestTracesResponse.fromJson(Map<String, dynamic> json) {
    return RoutingRequestTracesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => _sdkworkAsMap(item))
            .whereType<Map<String, dynamic>>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item).toList(),
    };
  }
}

class RoutingStrategyListResult {
  final String? code;
  final RoutingStrategySnapshot? data;
  final String? message;
  final String? msg;

  RoutingStrategyListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingStrategyListResult.fromJson(Map<String, dynamic> json) {
    return RoutingStrategyListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingStrategySnapshot.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingStrategySnapshot {
  final List<Map<String, dynamic>>? mappingRules;
  final String? strategy;

  RoutingStrategySnapshot({
    this.mappingRules,
    this.strategy
  });

  factory RoutingStrategySnapshot.fromJson(Map<String, dynamic> json) {
    return RoutingStrategySnapshot(
      mappingRules: (() {
        final list = _sdkworkAsList(json['mappingRules']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => _sdkworkAsMap(item))
            .whereType<Map<String, dynamic>>()
            .toList();
      })(),
      strategy: json['strategy']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'mappingRules': mappingRules?.map((item) => item).toList(),
      'strategy': strategy,
    };
  }
}

class RoutingStrategyUpdateResult {
  final String? code;
  final UpdateRoutingStrategyResponse? data;
  final String? message;
  final String? msg;

  RoutingStrategyUpdateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingStrategyUpdateResult.fromJson(Map<String, dynamic> json) {
    return RoutingStrategyUpdateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : UpdateRoutingStrategyResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingUsageListResult {
  final String? code;
  final RoutingUsageSnapshot? data;
  final String? message;
  final String? msg;

  RoutingUsageListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory RoutingUsageListResult.fromJson(Map<String, dynamic> json) {
    return RoutingUsageListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : RoutingUsageSnapshot.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class RoutingUsageSnapshot {
  final List<Map<String, dynamic>>? chartData;
  final List<Map<String, dynamic>>? modelStats;

  RoutingUsageSnapshot({
    this.chartData,
    this.modelStats
  });

  factory RoutingUsageSnapshot.fromJson(Map<String, dynamic> json) {
    return RoutingUsageSnapshot(
      chartData: (() {
        final list = _sdkworkAsList(json['chartData']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => _sdkworkAsMap(item))
            .whereType<Map<String, dynamic>>()
            .toList();
      })(),
      modelStats: (() {
        final list = _sdkworkAsList(json['modelStats']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => _sdkworkAsMap(item))
            .whereType<Map<String, dynamic>>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'chartData': chartData?.map((item) => item).toList(),
      'modelStats': modelStats?.map((item) => item).toList(),
    };
  }
}

class SessionsCreateResult {
  final String? code;
  final IamSessionResponse? data;
  final String? message;
  final String? msg;

  SessionsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SessionsCreateResult.fromJson(Map<String, dynamic> json) {
    return SessionsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SessionsCurrentDeleteResult {
  final String? code;
  final NoData? data;
  final String? message;
  final String? msg;

  SessionsCurrentDeleteResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SessionsCurrentDeleteResult.fromJson(Map<String, dynamic> json) {
    return SessionsCurrentDeleteResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : NoData.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SessionsCurrentRetrieveResult {
  final String? code;
  final IamSessionResponse? data;
  final String? message;
  final String? msg;

  SessionsCurrentRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SessionsCurrentRetrieveResult.fromJson(Map<String, dynamic> json) {
    return SessionsCurrentRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SessionsCurrentUpdateResult {
  final String? code;
  final IamSessionResponse? data;
  final String? message;
  final String? msg;

  SessionsCurrentUpdateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SessionsCurrentUpdateResult.fromJson(Map<String, dynamic> json) {
    return SessionsCurrentUpdateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SessionsRefreshResult {
  final String? code;
  final IamSessionResponse? data;
  final String? message;
  final String? msg;

  SessionsRefreshResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SessionsRefreshResult.fromJson(Map<String, dynamic> json) {
    return SessionsRefreshResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamSessionResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SetRoutingChannelStatusRequest {
  final String? status;

  SetRoutingChannelStatusRequest({
    this.status
  });

  factory SetRoutingChannelStatusRequest.fromJson(Map<String, dynamic> json) {
    return SetRoutingChannelStatusRequest(
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'status': status,
    };
  }
}

class SettingsDataResponse {
  final String? language;
  final SettingsNotifications? notifications;
  final String? timezone;
  final String? webhookUrl;

  SettingsDataResponse({
    this.language,
    this.notifications,
    this.timezone,
    this.webhookUrl
  });

  factory SettingsDataResponse.fromJson(Map<String, dynamic> json) {
    return SettingsDataResponse(
      language: json['language']?.toString(),
      notifications: (() {
        final map = _sdkworkAsMap(json['notifications']);
        return map == null ? null : SettingsNotifications.fromJson(map);
      })(),
      timezone: json['timezone']?.toString(),
      webhookUrl: json['webhookUrl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'language': language,
      'notifications': notifications?.toJson(),
      'timezone': timezone,
      'webhookUrl': webhookUrl,
    };
  }
}

class SettingsNotifications {
  final bool? apiMonitor;
  final bool? billReminder;
  final bool? quotaWarning;

  SettingsNotifications({
    this.apiMonitor,
    this.billReminder,
    this.quotaWarning
  });

  factory SettingsNotifications.fromJson(Map<String, dynamic> json) {
    return SettingsNotifications(
      apiMonitor: json['apiMonitor'] is bool ? json['apiMonitor'] : null,
      billReminder: json['billReminder'] is bool ? json['billReminder'] : null,
      quotaWarning: json['quotaWarning'] is bool ? json['quotaWarning'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'apiMonitor': apiMonitor,
      'billReminder': billReminder,
      'quotaWarning': quotaWarning,
    };
  }
}

class SettlementBill {
  final SettlementBillBreakdown? breakdown;
  final String? endDate;
  final String? id;
  final String? period;
  final String? startDate;
  final String? status;
  final String? totalCost;
  final String? totalTokens;

  SettlementBill({
    this.breakdown,
    this.endDate,
    this.id,
    this.period,
    this.startDate,
    this.status,
    this.totalCost,
    this.totalTokens
  });

  factory SettlementBill.fromJson(Map<String, dynamic> json) {
    return SettlementBill(
      breakdown: (() {
        final map = _sdkworkAsMap(json['breakdown']);
        return map == null ? null : SettlementBillBreakdown.fromJson(map);
      })(),
      endDate: json['endDate']?.toString(),
      id: json['id']?.toString(),
      period: json['period']?.toString(),
      startDate: json['startDate']?.toString(),
      status: json['status']?.toString(),
      totalCost: json['totalCost']?.toString(),
      totalTokens: json['totalTokens']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'breakdown': breakdown?.toJson(),
      'endDate': endDate,
      'id': id,
      'period': period,
      'startDate': startDate,
      'status': status,
      'totalCost': totalCost,
      'totalTokens': totalTokens,
    };
  }
}

class SettlementBillBreakdown {
  final SettlementBillBreakdownItem? audio;
  final SettlementBillBreakdownItem? image;
  final SettlementBillBreakdownItem? music;
  final SettlementBillBreakdownItem? text;
  final SettlementBillBreakdownItem? video;

  SettlementBillBreakdown({
    this.audio,
    this.image,
    this.music,
    this.text,
    this.video
  });

  factory SettlementBillBreakdown.fromJson(Map<String, dynamic> json) {
    return SettlementBillBreakdown(
      audio: (() {
        final map = _sdkworkAsMap(json['audio']);
        return map == null ? null : SettlementBillBreakdownItem.fromJson(map);
      })(),
      image: (() {
        final map = _sdkworkAsMap(json['image']);
        return map == null ? null : SettlementBillBreakdownItem.fromJson(map);
      })(),
      music: (() {
        final map = _sdkworkAsMap(json['music']);
        return map == null ? null : SettlementBillBreakdownItem.fromJson(map);
      })(),
      text: (() {
        final map = _sdkworkAsMap(json['text']);
        return map == null ? null : SettlementBillBreakdownItem.fromJson(map);
      })(),
      video: (() {
        final map = _sdkworkAsMap(json['video']);
        return map == null ? null : SettlementBillBreakdownItem.fromJson(map);
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio': audio?.toJson(),
      'image': image?.toJson(),
      'music': music?.toJson(),
      'text': text?.toJson(),
      'video': video?.toJson(),
    };
  }
}

class SettlementBillBreakdownItem {
  final String? cost;
  final List<String>? models;
  final String? usage;

  SettlementBillBreakdownItem({
    this.cost,
    this.models,
    this.usage
  });

  factory SettlementBillBreakdownItem.fromJson(Map<String, dynamic> json) {
    return SettlementBillBreakdownItem(
      cost: json['cost']?.toString(),
      models: (() {
        final list = _sdkworkAsList(json['models']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      usage: json['usage']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'cost': cost,
      'models': models?.map((item) => item).toList(),
      'usage': usage,
    };
  }
}

class SettlementChartPoint {
  final String? audio;
  final String? day;
  final String? image;
  final String? music;
  final String? text;
  final String? video;

  SettlementChartPoint({
    this.audio,
    this.day,
    this.image,
    this.music,
    this.text,
    this.video
  });

  factory SettlementChartPoint.fromJson(Map<String, dynamic> json) {
    return SettlementChartPoint(
      audio: json['audio']?.toString(),
      day: json['day']?.toString(),
      image: json['image']?.toString(),
      music: json['music']?.toString(),
      text: json['text']?.toString(),
      video: json['video']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'audio': audio,
      'day': day,
      'image': image,
      'music': music,
      'text': text,
      'video': video,
    };
  }
}

class SettlementDashboardResponse {
  final List<SettlementBill>? bills;
  final List<SettlementChartPoint>? chartData;

  SettlementDashboardResponse({
    this.bills,
    this.chartData
  });

  factory SettlementDashboardResponse.fromJson(Map<String, dynamic> json) {
    return SettlementDashboardResponse(
      bills: (() {
        final list = _sdkworkAsList(json['bills']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SettlementBill.fromJson(map);
      })())
            .whereType<SettlementBill>()
            .toList();
      })(),
      chartData: (() {
        final list = _sdkworkAsList(json['chartData']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SettlementChartPoint.fromJson(map);
      })())
            .whereType<SettlementChartPoint>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'bills': bills?.map((item) => item.toJson()).toList(),
      'chartData': chartData?.map((item) => item.toJson()).toList(),
    };
  }
}

class SettlementsDashboardListResult {
  final String? code;
  final SettlementDashboardResponse? data;
  final String? message;
  final String? msg;

  SettlementsDashboardListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SettlementsDashboardListResult.fromJson(Map<String, dynamic> json) {
    return SettlementsDashboardListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SettlementDashboardResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SkillCatalogItem {
  final String? category;
  final String? clawhubImage;
  final String? description;
  final String? developer;
  final String? downloads;
  final List<String>? features;
  final List<String>? frameworks;
  final String? id;
  final String? image;
  final String? lastUpdated;
  final String? license;
  final String? name;
  final List<SkillPackageItem>? packages;
  final double? rating;
  final List<String>? screenshots;
  final String? size;
  final String? version;

  SkillCatalogItem({
    this.category,
    this.clawhubImage,
    this.description,
    this.developer,
    this.downloads,
    this.features,
    this.frameworks,
    this.id,
    this.image,
    this.lastUpdated,
    this.license,
    this.name,
    this.packages,
    this.rating,
    this.screenshots,
    this.size,
    this.version
  });

  factory SkillCatalogItem.fromJson(Map<String, dynamic> json) {
    return SkillCatalogItem(
      category: json['category']?.toString(),
      clawhubImage: json['clawhubImage']?.toString(),
      description: json['description']?.toString(),
      developer: json['developer']?.toString(),
      downloads: json['downloads']?.toString(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      frameworks: (() {
        final list = _sdkworkAsList(json['frameworks']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
      image: json['image']?.toString(),
      lastUpdated: json['lastUpdated']?.toString(),
      license: json['license']?.toString(),
      name: json['name']?.toString(),
      packages: (() {
        final list = _sdkworkAsList(json['packages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SkillPackageItem.fromJson(map);
      })())
            .whereType<SkillPackageItem>()
            .toList();
      })(),
      rating: json['rating'] is num ? json['rating'].toDouble() : null,
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      size: json['size']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'clawhubImage': clawhubImage,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features?.map((item) => item).toList(),
      'frameworks': frameworks?.map((item) => item).toList(),
      'id': id,
      'image': image,
      'lastUpdated': lastUpdated,
      'license': license,
      'name': name,
      'packages': packages?.map((item) => item.toJson()).toList(),
      'rating': rating,
      'screenshots': screenshots?.map((item) => item).toList(),
      'size': size,
      'version': version,
    };
  }
}

class SkillCategoriesResponse {
  final List<String>? items;

  SkillCategoriesResponse({
    this.items
  });

  factory SkillCategoriesResponse.fromJson(Map<String, dynamic> json) {
    return SkillCategoriesResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item).toList(),
    };
  }
}

class SkillDetailResponse {
  final String? category;
  final String? clawhubImage;
  final String? description;
  final String? developer;
  final String? downloads;
  final List<String>? features;
  final List<String>? frameworks;
  final String? id;
  final String? image;
  final String? lastUpdated;
  final String? license;
  final String? name;
  final List<SkillPackageItem>? packages;
  final double? rating;
  final List<String>? screenshots;
  final String? size;
  final String? version;

  SkillDetailResponse({
    this.category,
    this.clawhubImage,
    this.description,
    this.developer,
    this.downloads,
    this.features,
    this.frameworks,
    this.id,
    this.image,
    this.lastUpdated,
    this.license,
    this.name,
    this.packages,
    this.rating,
    this.screenshots,
    this.size,
    this.version
  });

  factory SkillDetailResponse.fromJson(Map<String, dynamic> json) {
    return SkillDetailResponse(
      category: json['category']?.toString(),
      clawhubImage: json['clawhubImage']?.toString(),
      description: json['description']?.toString(),
      developer: json['developer']?.toString(),
      downloads: json['downloads']?.toString(),
      features: (() {
        final list = _sdkworkAsList(json['features']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      frameworks: (() {
        final list = _sdkworkAsList(json['frameworks']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
      image: json['image']?.toString(),
      lastUpdated: json['lastUpdated']?.toString(),
      license: json['license']?.toString(),
      name: json['name']?.toString(),
      packages: (() {
        final list = _sdkworkAsList(json['packages']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SkillPackageItem.fromJson(map);
      })())
            .whereType<SkillPackageItem>()
            .toList();
      })(),
      rating: json['rating'] is num ? json['rating'].toDouble() : null,
      screenshots: (() {
        final list = _sdkworkAsList(json['screenshots']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      size: json['size']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'category': category,
      'clawhubImage': clawhubImage,
      'description': description,
      'developer': developer,
      'downloads': downloads,
      'features': features?.map((item) => item).toList(),
      'frameworks': frameworks?.map((item) => item).toList(),
      'id': id,
      'image': image,
      'lastUpdated': lastUpdated,
      'license': license,
      'name': name,
      'packages': packages?.map((item) => item.toJson()).toList(),
      'rating': rating,
      'screenshots': screenshots?.map((item) => item).toList(),
      'size': size,
      'version': version,
    };
  }
}

class SkillPackageItem {
  final String? artifactRef;
  final int? artifactSizeBytes;
  final List<String>? frameworks;
  final String? id;
  final String? licenseName;
  final String? publishedAt;
  final String? version;

  SkillPackageItem({
    this.artifactRef,
    this.artifactSizeBytes,
    this.frameworks,
    this.id,
    this.licenseName,
    this.publishedAt,
    this.version
  });

  factory SkillPackageItem.fromJson(Map<String, dynamic> json) {
    return SkillPackageItem(
      artifactRef: json['artifactRef']?.toString(),
      artifactSizeBytes: json['artifactSizeBytes'] is int ? json['artifactSizeBytes'] : null,
      frameworks: (() {
        final list = _sdkworkAsList(json['frameworks']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      id: json['id']?.toString(),
      licenseName: json['licenseName']?.toString(),
      publishedAt: json['publishedAt']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'artifactRef': artifactRef,
      'artifactSizeBytes': artifactSizeBytes,
      'frameworks': frameworks?.map((item) => item).toList(),
      'id': id,
      'licenseName': licenseName,
      'publishedAt': publishedAt,
      'version': version,
    };
  }
}

class SkillsCatalogResponse {
  final List<SkillCatalogItem>? items;

  SkillsCatalogResponse({
    this.items
  });

  factory SkillsCatalogResponse.fromJson(Map<String, dynamic> json) {
    return SkillsCatalogResponse(
      items: (() {
        final list = _sdkworkAsList(json['items']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : SkillCatalogItem.fromJson(map);
      })())
            .whereType<SkillCatalogItem>()
            .toList();
      })()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'items': items?.map((item) => item.toJson()).toList(),
    };
  }
}

class SkillsCategoriesListResult {
  final String? code;
  final SkillCategoriesResponse? data;
  final String? message;
  final String? msg;

  SkillsCategoriesListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SkillsCategoriesListResult.fromJson(Map<String, dynamic> json) {
    return SkillsCategoriesListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SkillCategoriesResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SkillsConfigUpdateResult {
  final String? code;
  final AppInstalledSkillResponse? data;
  final String? message;
  final String? msg;

  SkillsConfigUpdateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SkillsConfigUpdateResult.fromJson(Map<String, dynamic> json) {
    return SkillsConfigUpdateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SkillsDisableResult {
  final String? code;
  final AppInstalledSkillResponse? data;
  final String? message;
  final String? msg;

  SkillsDisableResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SkillsDisableResult.fromJson(Map<String, dynamic> json) {
    return SkillsDisableResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SkillsEnableResult {
  final String? code;
  final AppInstalledSkillResponse? data;
  final String? message;
  final String? msg;

  SkillsEnableResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SkillsEnableResult.fromJson(Map<String, dynamic> json) {
    return SkillsEnableResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SkillsListResult {
  final String? code;
  final SkillsCatalogResponse? data;
  final String? message;
  final String? msg;

  SkillsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SkillsListResult.fromJson(Map<String, dynamic> json) {
    return SkillsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SkillsCatalogResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class SkillsRetrieveResult {
  final String? code;
  final SkillDetailResponse? data;
  final String? message;
  final String? msg;

  SkillsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory SkillsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return SkillsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SkillDetailResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class StudioCatalogActionRecord {
  final String? actionType;
  final String? clientIpHash;
  final String? createdAt;
  final String? id;
  final bool? legalHold;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? payloadHash;
  final String? ratingScore;
  final String? releaseId;
  final String? requestId;
  final String? retentionUntil;
  final String? reviewBody;
  final String? reviewTitle;
  final String? status;
  final String? targetId;
  final String? targetType;
  final String? tenantId;
  final String? traceId;
  final String? userAgentHash;
  final String? userId;
  final String? uuid;

  StudioCatalogActionRecord({
    this.actionType,
    this.clientIpHash,
    this.createdAt,
    this.id,
    this.legalHold,
    this.metadata,
    this.organizationId,
    this.payloadHash,
    this.ratingScore,
    this.releaseId,
    this.requestId,
    this.retentionUntil,
    this.reviewBody,
    this.reviewTitle,
    this.status,
    this.targetId,
    this.targetType,
    this.tenantId,
    this.traceId,
    this.userAgentHash,
    this.userId,
    this.uuid
  });

  factory StudioCatalogActionRecord.fromJson(Map<String, dynamic> json) {
    return StudioCatalogActionRecord(
      actionType: json['action_type']?.toString(),
      clientIpHash: json['client_ip_hash']?.toString(),
      createdAt: json['created_at']?.toString(),
      id: json['id']?.toString(),
      legalHold: json['legal_hold'] is bool ? json['legal_hold'] : null,
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      payloadHash: json['payload_hash']?.toString(),
      ratingScore: json['rating_score']?.toString(),
      releaseId: json['release_id']?.toString(),
      requestId: json['request_id']?.toString(),
      retentionUntil: json['retention_until']?.toString(),
      reviewBody: json['review_body']?.toString(),
      reviewTitle: json['review_title']?.toString(),
      status: json['status']?.toString(),
      targetId: json['target_id']?.toString(),
      targetType: json['target_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      traceId: json['trace_id']?.toString(),
      userAgentHash: json['user_agent_hash']?.toString(),
      userId: json['user_id']?.toString(),
      uuid: json['uuid']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'action_type': actionType,
      'client_ip_hash': clientIpHash,
      'created_at': createdAt,
      'id': id,
      'legal_hold': legalHold,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'payload_hash': payloadHash,
      'rating_score': ratingScore,
      'release_id': releaseId,
      'request_id': requestId,
      'retention_until': retentionUntil,
      'review_body': reviewBody,
      'review_title': reviewTitle,
      'status': status,
      'target_id': targetId,
      'target_type': targetType,
      'tenant_id': tenantId,
      'trace_id': traceId,
      'user_agent_hash': userAgentHash,
      'user_id': userId,
      'uuid': uuid,
    };
  }
}

class StudioCatalogArtifactRecord {
  final String? artifactRef;
  final String? artifactSizeBytes;
  final String? artifactType;
  final String? artifactUrl;
  final String? checksumHash;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? deprecatedAt;
  final Map<String, dynamic>? frameworks;
  final String? id;
  final String? licenseName;
  final Map<String, dynamic>? metadata;
  final String? organizationId;
  final String? osName;
  final String? platformType;
  final String? publishedAt;
  final String? releaseNotes;
  final String? runtime;
  final String? status;
  final String? targetId;
  final String? targetType;
  final String? tenantId;
  final String? updatedAt;
  final String? uuid;
  final String? version;

  StudioCatalogArtifactRecord({
    this.artifactRef,
    this.artifactSizeBytes,
    this.artifactType,
    this.artifactUrl,
    this.checksumHash,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.deprecatedAt,
    this.frameworks,
    this.id,
    this.licenseName,
    this.metadata,
    this.organizationId,
    this.osName,
    this.platformType,
    this.publishedAt,
    this.releaseNotes,
    this.runtime,
    this.status,
    this.targetId,
    this.targetType,
    this.tenantId,
    this.updatedAt,
    this.uuid,
    this.version
  });

  factory StudioCatalogArtifactRecord.fromJson(Map<String, dynamic> json) {
    return StudioCatalogArtifactRecord(
      artifactRef: json['artifact_ref']?.toString(),
      artifactSizeBytes: json['artifact_size_bytes']?.toString(),
      artifactType: json['artifact_type']?.toString(),
      artifactUrl: json['artifact_url']?.toString(),
      checksumHash: json['checksum_hash']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      deprecatedAt: json['deprecated_at']?.toString(),
      frameworks: (() {
        final map = _sdkworkAsMap(json['frameworks']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      id: json['id']?.toString(),
      licenseName: json['license_name']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      organizationId: json['organization_id']?.toString(),
      osName: json['os_name']?.toString(),
      platformType: json['platform_type']?.toString(),
      publishedAt: json['published_at']?.toString(),
      releaseNotes: json['release_notes']?.toString(),
      runtime: json['runtime']?.toString(),
      status: json['status']?.toString(),
      targetId: json['target_id']?.toString(),
      targetType: json['target_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'artifact_ref': artifactRef,
      'artifact_size_bytes': artifactSizeBytes,
      'artifact_type': artifactType,
      'artifact_url': artifactUrl,
      'checksum_hash': checksumHash,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'deprecated_at': deprecatedAt,
      'frameworks': frameworks?.map((key, item) => MapEntry(key, item)),
      'id': id,
      'license_name': licenseName,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'organization_id': organizationId,
      'os_name': osName,
      'platform_type': platformType,
      'published_at': publishedAt,
      'release_notes': releaseNotes,
      'runtime': runtime,
      'status': status,
      'target_id': targetId,
      'target_type': targetType,
      'tenant_id': tenantId,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
    };
  }
}

class StudioCatalogAssetRecord {
  final String? altText;
  final String? artifactId;
  final String? assetType;
  final String? assetUrl;
  final String? createdAt;
  final String? dataScope;
  final String? deletedAt;
  final String? deletedBy;
  final String? durationSeconds;
  final String? fileSize;
  final int? height;
  final String? id;
  final Map<String, dynamic>? metadata;
  final String? mimeType;
  final String? organizationId;
  final String? publishedAt;
  final int? sortOrder;
  final String? status;
  final String? targetId;
  final String? targetType;
  final String? tenantId;
  final String? thumbnailUrl;
  final String? title;
  final String? updatedAt;
  final String? uuid;
  final String? version;
  final int? width;

  StudioCatalogAssetRecord({
    this.altText,
    this.artifactId,
    this.assetType,
    this.assetUrl,
    this.createdAt,
    this.dataScope,
    this.deletedAt,
    this.deletedBy,
    this.durationSeconds,
    this.fileSize,
    this.height,
    this.id,
    this.metadata,
    this.mimeType,
    this.organizationId,
    this.publishedAt,
    this.sortOrder,
    this.status,
    this.targetId,
    this.targetType,
    this.tenantId,
    this.thumbnailUrl,
    this.title,
    this.updatedAt,
    this.uuid,
    this.version,
    this.width
  });

  factory StudioCatalogAssetRecord.fromJson(Map<String, dynamic> json) {
    return StudioCatalogAssetRecord(
      altText: json['alt_text']?.toString(),
      artifactId: json['artifact_id']?.toString(),
      assetType: json['asset_type']?.toString(),
      assetUrl: json['asset_url']?.toString(),
      createdAt: json['created_at']?.toString(),
      dataScope: json['data_scope']?.toString(),
      deletedAt: json['deleted_at']?.toString(),
      deletedBy: json['deleted_by']?.toString(),
      durationSeconds: json['duration_seconds']?.toString(),
      fileSize: json['file_size']?.toString(),
      height: json['height'] is int ? json['height'] : null,
      id: json['id']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      mimeType: json['mime_type']?.toString(),
      organizationId: json['organization_id']?.toString(),
      publishedAt: json['published_at']?.toString(),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : null,
      status: json['status']?.toString(),
      targetId: json['target_id']?.toString(),
      targetType: json['target_type']?.toString(),
      tenantId: json['tenant_id']?.toString(),
      thumbnailUrl: json['thumbnail_url']?.toString(),
      title: json['title']?.toString(),
      updatedAt: json['updated_at']?.toString(),
      uuid: json['uuid']?.toString(),
      version: json['version']?.toString(),
      width: json['width'] is int ? json['width'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'alt_text': altText,
      'artifact_id': artifactId,
      'asset_type': assetType,
      'asset_url': assetUrl,
      'created_at': createdAt,
      'data_scope': dataScope,
      'deleted_at': deletedAt,
      'deleted_by': deletedBy,
      'duration_seconds': durationSeconds,
      'file_size': fileSize,
      'height': height,
      'id': id,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'mime_type': mimeType,
      'organization_id': organizationId,
      'published_at': publishedAt,
      'sort_order': sortOrder,
      'status': status,
      'target_id': targetId,
      'target_type': targetType,
      'tenant_id': tenantId,
      'thumbnail_url': thumbnailUrl,
      'title': title,
      'updated_at': updatedAt,
      'uuid': uuid,
      'version': version,
      'width': width,
    };
  }
}

class SubmitRechargeRequest {
  final String? amount;
  final String? method;

  SubmitRechargeRequest({
    this.amount,
    this.method
  });

  factory SubmitRechargeRequest.fromJson(Map<String, dynamic> json) {
    return SubmitRechargeRequest(
      amount: json['amount']?.toString(),
      method: json['method']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'method': method,
    };
  }
}

class SubmitRechargeResponse {
  final String? amount;
  final String? orderNo;
  final String? paymentMethod;
  final int? points;
  final String? status;
  final bool? success;

  SubmitRechargeResponse({
    this.amount,
    this.orderNo,
    this.paymentMethod,
    this.points,
    this.status,
    this.success
  });

  factory SubmitRechargeResponse.fromJson(Map<String, dynamic> json) {
    return SubmitRechargeResponse(
      amount: json['amount']?.toString(),
      orderNo: json['orderNo']?.toString(),
      paymentMethod: json['paymentMethod']?.toString(),
      points: json['points'] is int ? json['points'] : null,
      status: json['status']?.toString(),
      success: json['success'] is bool ? json['success'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'amount': amount,
      'orderNo': orderNo,
      'paymentMethod': paymentMethod,
      'points': points,
      'status': status,
      'success': success,
    };
  }
}

class SystemInstallationStateRecord {
  final String? catalogVersion;
  final String? databaseEngine;
  final String? environment;
  final String? id;
  final String? installationId;
  final String? installedAt;
  final String? lastCheckedAt;
  final Map<String, dynamic>? metadata;
  final String? schemaVersion;
  final String? seedProfile;
  final String? status;
  final String? upgradedAt;

  SystemInstallationStateRecord({
    this.catalogVersion,
    this.databaseEngine,
    this.environment,
    this.id,
    this.installationId,
    this.installedAt,
    this.lastCheckedAt,
    this.metadata,
    this.schemaVersion,
    this.seedProfile,
    this.status,
    this.upgradedAt
  });

  factory SystemInstallationStateRecord.fromJson(Map<String, dynamic> json) {
    return SystemInstallationStateRecord(
      catalogVersion: json['catalog_version']?.toString(),
      databaseEngine: json['database_engine']?.toString(),
      environment: json['environment']?.toString(),
      id: json['id']?.toString(),
      installationId: json['installation_id']?.toString(),
      installedAt: json['installed_at']?.toString(),
      lastCheckedAt: json['last_checked_at']?.toString(),
      metadata: (() {
        final map = _sdkworkAsMap(json['metadata']);
        if (map == null) {
          return null;
        }
        final result = <String, String>{};
        map.forEach((key, item) {
          final deserialized = item?.toString();
          if (deserialized is String) {
            result[key] = deserialized;
          }
        });
        return result;
      })(),
      schemaVersion: json['schema_version']?.toString(),
      seedProfile: json['seed_profile']?.toString(),
      status: json['status']?.toString(),
      upgradedAt: json['upgraded_at']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'catalog_version': catalogVersion,
      'database_engine': databaseEngine,
      'environment': environment,
      'id': id,
      'installation_id': installationId,
      'installed_at': installedAt,
      'last_checked_at': lastCheckedAt,
      'metadata': metadata?.map((key, item) => MapEntry(key, item)),
      'schema_version': schemaVersion,
      'seed_profile': seedProfile,
      'status': status,
      'upgraded_at': upgradedAt,
    };
  }
}

class SystemSchemaMigrationRecord {
  final String? checksum;
  final String? errorMessage;
  final String? finishedAt;
  final String? id;
  final String? migrationKey;
  final String? migrationVersion;
  final String? startedAt;
  final String? status;

  SystemSchemaMigrationRecord({
    this.checksum,
    this.errorMessage,
    this.finishedAt,
    this.id,
    this.migrationKey,
    this.migrationVersion,
    this.startedAt,
    this.status
  });

  factory SystemSchemaMigrationRecord.fromJson(Map<String, dynamic> json) {
    return SystemSchemaMigrationRecord(
      checksum: json['checksum']?.toString(),
      errorMessage: json['error_message']?.toString(),
      finishedAt: json['finished_at']?.toString(),
      id: json['id']?.toString(),
      migrationKey: json['migration_key']?.toString(),
      migrationVersion: json['migration_version']?.toString(),
      startedAt: json['started_at']?.toString(),
      status: json['status']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'checksum': checksum,
      'error_message': errorMessage,
      'finished_at': finishedAt,
      'id': id,
      'migration_key': migrationKey,
      'migration_version': migrationVersion,
      'started_at': startedAt,
      'status': status,
    };
  }
}

class UpdateRoutingChannelRequest {
  final String? accessType;
  final String? baseUrl;
  final List<String>? capabilities;
  final List<String>? models;
  final String? name;
  final String? protocol;
  final String? secretRef;
  final String? status;
  final String? vendor;
  final int? weight;

  UpdateRoutingChannelRequest({
    this.accessType,
    this.baseUrl,
    this.capabilities,
    this.models,
    this.name,
    this.protocol,
    this.secretRef,
    this.status,
    this.vendor,
    this.weight
  });

  factory UpdateRoutingChannelRequest.fromJson(Map<String, dynamic> json) {
    return UpdateRoutingChannelRequest(
      accessType: json['accessType']?.toString(),
      baseUrl: json['baseUrl']?.toString(),
      capabilities: (() {
        final list = _sdkworkAsList(json['capabilities']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      models: (() {
        final list = _sdkworkAsList(json['models']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => item?.toString())
            .whereType<String>()
            .toList();
      })(),
      name: json['name']?.toString(),
      protocol: json['protocol']?.toString(),
      secretRef: json['secretRef']?.toString(),
      status: json['status']?.toString(),
      vendor: json['vendor']?.toString(),
      weight: json['weight'] is int ? json['weight'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'accessType': accessType,
      'baseUrl': baseUrl,
      'capabilities': capabilities?.map((item) => item).toList(),
      'models': models?.map((item) => item).toList(),
      'name': name,
      'protocol': protocol,
      'secretRef': secretRef,
      'status': status,
      'vendor': vendor,
      'weight': weight,
    };
  }
}

class UpdateRoutingStrategyRequest {
  final List<Map<String, dynamic>>? mappingRules;
  final String? strategy;

  UpdateRoutingStrategyRequest({
    this.mappingRules,
    this.strategy
  });

  factory UpdateRoutingStrategyRequest.fromJson(Map<String, dynamic> json) {
    return UpdateRoutingStrategyRequest(
      mappingRules: (() {
        final list = _sdkworkAsList(json['mappingRules']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => _sdkworkAsMap(item))
            .whereType<Map<String, dynamic>>()
            .toList();
      })(),
      strategy: json['strategy']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'mappingRules': mappingRules?.map((item) => item).toList(),
      'strategy': strategy,
    };
  }
}

class UpdateRoutingStrategyResponse {
  final bool? success;

  UpdateRoutingStrategyResponse({
    this.success
  });

  factory UpdateRoutingStrategyResponse.fromJson(Map<String, dynamic> json) {
    return UpdateRoutingStrategyResponse(
      success: json['success'] is bool ? json['success'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'success': success,
    };
  }
}

class UpdateSettingsRequest {
  final String? language;
  final SettingsNotifications? notifications;
  final String? timezone;
  final String? webhookUrl;

  UpdateSettingsRequest({
    this.language,
    this.notifications,
    this.timezone,
    this.webhookUrl
  });

  factory UpdateSettingsRequest.fromJson(Map<String, dynamic> json) {
    return UpdateSettingsRequest(
      language: json['language']?.toString(),
      notifications: (() {
        final map = _sdkworkAsMap(json['notifications']);
        return map == null ? null : SettingsNotifications.fromJson(map);
      })(),
      timezone: json['timezone']?.toString(),
      webhookUrl: json['webhookUrl']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'language': language,
      'notifications': notifications?.toJson(),
      'timezone': timezone,
      'webhookUrl': webhookUrl,
    };
  }
}

class UpdateSettingsResponse {
  final bool? success;

  UpdateSettingsResponse({
    this.success
  });

  factory UpdateSettingsResponse.fromJson(Map<String, dynamic> json) {
    return UpdateSettingsResponse(
      success: json['success'] is bool ? json['success'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'success': success,
    };
  }
}

class UsageLogItem {
  final String? baseInputPrice;
  final String? baseOutputPrice;
  final String? cacheReadPrice;
  final int? cacheReadTokens;
  final String? cost;
  final String? group;
  final String? id;
  final int? inputTokens;
  final String? ip;
  final bool? isStream;
  final String? model;
  final String? multiplier;
  final int? outputTokens;
  final String? path;
  final String? reasoningEffort;
  final String? requestId;
  final String? time;
  final String? tokenName;
  final String? totalTime;
  final String? ttft;
  final String? type;

  UsageLogItem({
    this.baseInputPrice,
    this.baseOutputPrice,
    this.cacheReadPrice,
    this.cacheReadTokens,
    this.cost,
    this.group,
    this.id,
    this.inputTokens,
    this.ip,
    this.isStream,
    this.model,
    this.multiplier,
    this.outputTokens,
    this.path,
    this.reasoningEffort,
    this.requestId,
    this.time,
    this.tokenName,
    this.totalTime,
    this.ttft,
    this.type
  });

  factory UsageLogItem.fromJson(Map<String, dynamic> json) {
    return UsageLogItem(
      baseInputPrice: json['baseInputPrice']?.toString(),
      baseOutputPrice: json['baseOutputPrice']?.toString(),
      cacheReadPrice: json['cacheReadPrice']?.toString(),
      cacheReadTokens: json['cacheReadTokens'] is int ? json['cacheReadTokens'] : null,
      cost: json['cost']?.toString(),
      group: json['group']?.toString(),
      id: json['id']?.toString(),
      inputTokens: json['inputTokens'] is int ? json['inputTokens'] : null,
      ip: json['ip']?.toString(),
      isStream: json['isStream'] is bool ? json['isStream'] : null,
      model: json['model']?.toString(),
      multiplier: json['multiplier']?.toString(),
      outputTokens: json['outputTokens'] is int ? json['outputTokens'] : null,
      path: json['path']?.toString(),
      reasoningEffort: json['reasoningEffort']?.toString(),
      requestId: json['requestId']?.toString(),
      time: json['time']?.toString(),
      tokenName: json['tokenName']?.toString(),
      totalTime: json['totalTime']?.toString(),
      ttft: json['ttft']?.toString(),
      type: json['type']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'baseInputPrice': baseInputPrice,
      'baseOutputPrice': baseOutputPrice,
      'cacheReadPrice': cacheReadPrice,
      'cacheReadTokens': cacheReadTokens,
      'cost': cost,
      'group': group,
      'id': id,
      'inputTokens': inputTokens,
      'ip': ip,
      'isStream': isStream,
      'model': model,
      'multiplier': multiplier,
      'outputTokens': outputTokens,
      'path': path,
      'reasoningEffort': reasoningEffort,
      'requestId': requestId,
      'time': time,
      'tokenName': tokenName,
      'totalTime': totalTime,
      'ttft': ttft,
      'type': type,
    };
  }
}

class UsageLogsListResult {
  final String? code;
  final UsageLogsResponse? data;
  final String? message;
  final String? msg;

  UsageLogsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsageLogsListResult.fromJson(Map<String, dynamic> json) {
    return UsageLogsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : UsageLogsResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class UsageLogsResponse {
  final List<UsageLogItem>? logs;
  final int? page;
  final int? pageSize;
  final int? total;

  UsageLogsResponse({
    this.logs,
    this.page,
    this.pageSize,
    this.total
  });

  factory UsageLogsResponse.fromJson(Map<String, dynamic> json) {
    return UsageLogsResponse(
      logs: (() {
        final list = _sdkworkAsList(json['logs']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : UsageLogItem.fromJson(map);
      })())
            .whereType<UsageLogItem>()
            .toList();
      })(),
      page: json['page'] is int ? json['page'] : null,
      pageSize: json['pageSize'] is int ? json['pageSize'] : null,
      total: json['total'] is int ? json['total'] : null
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'logs': logs?.map((item) => item.toJson()).toList(),
      'page': page,
      'pageSize': pageSize,
      'total': total,
    };
  }
}

class UsersCurrentCommentsListResult {
  final String? code;
  final ForumCommentPage? data;
  final String? message;
  final String? msg;

  UsersCurrentCommentsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsersCurrentCommentsListResult.fromJson(Map<String, dynamic> json) {
    return UsersCurrentCommentsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : ForumCommentPage.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class UsersCurrentCouponsListResult {
  final String? code;
  final List<BillingRedeemHistoryItem>? data;
  final String? message;
  final String? msg;

  UsersCurrentCouponsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsersCurrentCouponsListResult.fromJson(Map<String, dynamic> json) {
    return UsersCurrentCouponsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : BillingRedeemHistoryItem.fromJson(map);
      })())
            .whereType<BillingRedeemHistoryItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class UsersCurrentCouponsRetrieveResult {
  final String? code;
  final BillingRedeemHistoryItem? data;
  final String? message;
  final String? msg;

  UsersCurrentCouponsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsersCurrentCouponsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return UsersCurrentCouponsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : BillingRedeemHistoryItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class UsersCurrentRetrieveResult {
  final String? code;
  final IamUserResponse? data;
  final String? message;
  final String? msg;

  UsersCurrentRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsersCurrentRetrieveResult.fromJson(Map<String, dynamic> json) {
    return UsersCurrentRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamUserResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class UsersCurrentSkillsListResult {
  final String? code;
  final AppInstalledSkillsResponse? data;
  final String? message;
  final String? msg;

  UsersCurrentSkillsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsersCurrentSkillsListResult.fromJson(Map<String, dynamic> json) {
    return UsersCurrentSkillsListResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : AppInstalledSkillsResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class UsersSettingsRetrieveResult {
  final String? code;
  final SettingsDataResponse? data;
  final String? message;
  final String? msg;

  UsersSettingsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsersSettingsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return UsersSettingsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : SettingsDataResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class UsersSettingsUpdateResult {
  final String? code;
  final UpdateSettingsResponse? data;
  final String? message;
  final String? msg;

  UsersSettingsUpdateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory UsersSettingsUpdateResult.fromJson(Map<String, dynamic> json) {
    return UsersSettingsUpdateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : UpdateSettingsResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VerificationCodesCreateResult {
  final String? code;
  final IamVerificationCodeResponse? data;
  final String? message;
  final String? msg;

  VerificationCodesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VerificationCodesCreateResult.fromJson(Map<String, dynamic> json) {
    return VerificationCodesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamVerificationCodeResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VerificationCodesVerifyResult {
  final String? code;
  final IamVerificationCodeVerifyResponse? data;
  final String? message;
  final String? msg;

  VerificationCodesVerifyResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VerificationCodesVerifyResult.fromJson(Map<String, dynamic> json) {
    return VerificationCodesVerifyResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : IamVerificationCodeVerifyResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipBenefitsListResult {
  final String? code;
  final List<CommerceVipBenefitItem>? data;
  final String? message;
  final String? msg;

  VipBenefitsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipBenefitsListResult.fromJson(Map<String, dynamic> json) {
    return VipBenefitsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceVipBenefitItem.fromJson(map);
      })())
            .whereType<CommerceVipBenefitItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipInfoRetrieveResult {
  final String? code;
  final CommerceVipInfoResponse? data;
  final String? message;
  final String? msg;

  VipInfoRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipInfoRetrieveResult.fromJson(Map<String, dynamic> json) {
    return VipInfoRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceVipInfoResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipLevelsListResult {
  final String? code;
  final List<CommerceVipLevelItem>? data;
  final String? message;
  final String? msg;

  VipLevelsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipLevelsListResult.fromJson(Map<String, dynamic> json) {
    return VipLevelsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceVipLevelItem.fromJson(map);
      })())
            .whereType<CommerceVipLevelItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPackGroupsListResult {
  final String? code;
  final List<CommerceVipPackGroupItem>? data;
  final String? message;
  final String? msg;

  VipPackGroupsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPackGroupsListResult.fromJson(Map<String, dynamic> json) {
    return VipPackGroupsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceVipPackGroupItem.fromJson(map);
      })())
            .whereType<CommerceVipPackGroupItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPackGroupsPacksListResult {
  final String? code;
  final List<CommerceVipPackItem>? data;
  final String? message;
  final String? msg;

  VipPackGroupsPacksListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPackGroupsPacksListResult.fromJson(Map<String, dynamic> json) {
    return VipPackGroupsPacksListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceVipPackItem.fromJson(map);
      })())
            .whereType<CommerceVipPackItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPackGroupsRetrieveResult {
  final String? code;
  final CommerceVipPackGroupItem? data;
  final String? message;
  final String? msg;

  VipPackGroupsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPackGroupsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return VipPackGroupsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceVipPackGroupItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPacksListResult {
  final String? code;
  final List<RechargePackage>? data;
  final String? message;
  final String? msg;

  VipPacksListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPacksListResult.fromJson(Map<String, dynamic> json) {
    return VipPacksListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : RechargePackage.fromJson(map);
      })())
            .whereType<RechargePackage>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPacksRetrieveResult {
  final String? code;
  final CommerceVipPackItem? data;
  final String? message;
  final String? msg;

  VipPacksRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPacksRetrieveResult.fromJson(Map<String, dynamic> json) {
    return VipPacksRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceVipPackItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPointsBalanceRetrieveResult {
  final String? code;
  final CommercePointsBalanceResponse? data;
  final String? message;
  final String? msg;

  VipPointsBalanceRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPointsBalanceRetrieveResult.fromJson(Map<String, dynamic> json) {
    return VipPointsBalanceRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommercePointsBalanceResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPointsDailyRewardsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  VipPointsDailyRewardsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPointsDailyRewardsCreateResult.fromJson(Map<String, dynamic> json) {
    return VipPointsDailyRewardsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPointsDailyRewardsStatusRetrieveResult {
  final String? code;
  final CommerceVipDailyRewardStatusResponse? data;
  final String? message;
  final String? msg;

  VipPointsDailyRewardsStatusRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPointsDailyRewardsStatusRetrieveResult.fromJson(Map<String, dynamic> json) {
    return VipPointsDailyRewardsStatusRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceVipDailyRewardStatusResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPointsHistoryListResult {
  final String? code;
  final List<CommercePointsHistoryItem>? data;
  final String? message;
  final String? msg;

  VipPointsHistoryListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPointsHistoryListResult.fromJson(Map<String, dynamic> json) {
    return VipPointsHistoryListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommercePointsHistoryItem.fromJson(map);
      })())
            .whereType<CommercePointsHistoryItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPrivilegesSpeedUpsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  VipPrivilegesSpeedUpsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPrivilegesSpeedUpsCreateResult.fromJson(Map<String, dynamic> json) {
    return VipPrivilegesSpeedUpsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPrivilegesUsageRetrieveResult {
  final String? code;
  final List<CommerceVipPrivilegeUsageItem>? data;
  final String? message;
  final String? msg;

  VipPrivilegesUsageRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPrivilegesUsageRetrieveResult.fromJson(Map<String, dynamic> json) {
    return VipPrivilegesUsageRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceVipPrivilegeUsageItem.fromJson(map);
      })())
            .whereType<CommerceVipPrivilegeUsageItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPurchaseCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  VipPurchaseCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPurchaseCreateResult.fromJson(Map<String, dynamic> json) {
    return VipPurchaseCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPurchaseRenewResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  VipPurchaseRenewResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPurchaseRenewResult.fromJson(Map<String, dynamic> json) {
    return VipPurchaseRenewResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipPurchaseUpgradeResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  VipPurchaseUpgradeResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipPurchaseUpgradeResult.fromJson(Map<String, dynamic> json) {
    return VipPurchaseUpgradeResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class VipStatusRetrieveResult {
  final String? code;
  final CommerceVipInfoResponse? data;
  final String? message;
  final String? msg;

  VipStatusRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory VipStatusRetrieveResult.fromJson(Map<String, dynamic> json) {
    return VipStatusRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceVipInfoResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletAccountsListResult {
  final String? code;
  final List<CommerceWalletAccountItem>? data;
  final String? message;
  final String? msg;

  WalletAccountsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletAccountsListResult.fromJson(Map<String, dynamic> json) {
    return WalletAccountsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceWalletAccountItem.fromJson(map);
      })())
            .whereType<CommerceWalletAccountItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletExchangesCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  WalletExchangesCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletExchangesCreateResult.fromJson(Map<String, dynamic> json) {
    return WalletExchangesCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletOperationsRetrieveResult {
  final String? code;
  final CommerceWalletTransactionItem? data;
  final String? message;
  final String? msg;

  WalletOperationsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletOperationsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return WalletOperationsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceWalletTransactionItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletOverviewRetrieveResult {
  final String? code;
  final CommerceWalletOverviewResponse? data;
  final String? message;
  final String? msg;

  WalletOverviewRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletOverviewRetrieveResult.fromJson(Map<String, dynamic> json) {
    return WalletOverviewRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceWalletOverviewResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletTopupsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  WalletTopupsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletTopupsCreateResult.fromJson(Map<String, dynamic> json) {
    return WalletTopupsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletTransactionsListResult {
  final String? code;
  final List<CommerceWalletTransactionItem>? data;
  final String? message;
  final String? msg;

  WalletTransactionsListResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletTransactionsListResult.fromJson(Map<String, dynamic> json) {
    return WalletTransactionsListResult(
      code: json['code']?.toString(),
      data: (() {
        final list = _sdkworkAsList(json['data']);
        if (list == null) {
          return null;
        }
        return list
            .map((item) => (() {
        final map = _sdkworkAsMap(item);
        return map == null ? null : CommerceWalletTransactionItem.fromJson(map);
      })())
            .whereType<CommerceWalletTransactionItem>()
            .toList();
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.map((item) => item.toJson()).toList(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletTransactionsRetrieveResult {
  final String? code;
  final CommerceWalletTransactionItem? data;
  final String? message;
  final String? msg;

  WalletTransactionsRetrieveResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletTransactionsRetrieveResult.fromJson(Map<String, dynamic> json) {
    return WalletTransactionsRetrieveResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceWalletTransactionItem.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletTransfersCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  WalletTransfersCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletTransfersCreateResult.fromJson(Map<String, dynamic> json) {
    return WalletTransfersCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}

class WalletWithdrawalsCreateResult {
  final String? code;
  final CommerceOperationResponse? data;
  final String? message;
  final String? msg;

  WalletWithdrawalsCreateResult({
    this.code,
    this.data,
    this.message,
    this.msg
  });

  factory WalletWithdrawalsCreateResult.fromJson(Map<String, dynamic> json) {
    return WalletWithdrawalsCreateResult(
      code: json['code']?.toString(),
      data: (() {
        final map = _sdkworkAsMap(json['data']);
        return map == null ? null : CommerceOperationResponse.fromJson(map);
      })(),
      message: json['message']?.toString(),
      msg: json['msg']?.toString()
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'code': code,
      'data': data?.toJson(),
      'message': message,
      'msg': msg,
    };
  }
}
