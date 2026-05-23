package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiRuntimeInvocationRecord {
    private String agentRunId;
    private String agentRunStepId;
    private String agentSessionId;
    private String approvalPolicy;
    private Integer attemptNo;
    private String chatItemId;
    private String chatTurnId;
    private String completedAt;
    private String conversationId;
    private String createdAt;
    private String cwd;
    private String endpoint;
    private String errorCode;
    private String errorMessageMasked;
    private String errorType;
    private String exitCode;
    private String finishReason;
    private String id;
    private String invocationNo;
    private String invocationType;
    private String latencyMs;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String model;
    private String organizationId;
    private String payloadHash;
    private String permissionMode;
    private String provider;
    private String providerConversationId;
    private String providerResponseId;
    private String providerSessionId;
    private String providerStepId;
    private String requestId;
    private Map<String, String> requestJson;
    private Map<String, String> responseJson;
    private String retentionUntil;
    private String runtime;
    private String sandboxPolicy;
    private String startedAt;
    private String status;
    private String tenantId;
    private String toolCallId;
    private String toolName;
    private String traceId;
    private String ttftMs;
    private Map<String, String> usageJson;
    private String userId;
    private String uuid;

    public String getAgentRunId() {
        return this.agentRunId;
    }

    public void setAgentRunId(String agentRunId) {
        this.agentRunId = agentRunId;
    }

    public String getAgentRunStepId() {
        return this.agentRunStepId;
    }

    public void setAgentRunStepId(String agentRunStepId) {
        this.agentRunStepId = agentRunStepId;
    }

    public String getAgentSessionId() {
        return this.agentSessionId;
    }

    public void setAgentSessionId(String agentSessionId) {
        this.agentSessionId = agentSessionId;
    }

    public String getApprovalPolicy() {
        return this.approvalPolicy;
    }

    public void setApprovalPolicy(String approvalPolicy) {
        this.approvalPolicy = approvalPolicy;
    }

    public Integer getAttemptNo() {
        return this.attemptNo;
    }

    public void setAttemptNo(Integer attemptNo) {
        this.attemptNo = attemptNo;
    }

    public String getChatItemId() {
        return this.chatItemId;
    }

    public void setChatItemId(String chatItemId) {
        this.chatItemId = chatItemId;
    }

    public String getChatTurnId() {
        return this.chatTurnId;
    }

    public void setChatTurnId(String chatTurnId) {
        this.chatTurnId = chatTurnId;
    }

    public String getCompletedAt() {
        return this.completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }

    public String getConversationId() {
        return this.conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCwd() {
        return this.cwd;
    }

    public void setCwd(String cwd) {
        this.cwd = cwd;
    }

    public String getEndpoint() {
        return this.endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getErrorCode() {
        return this.errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessageMasked() {
        return this.errorMessageMasked;
    }

    public void setErrorMessageMasked(String errorMessageMasked) {
        this.errorMessageMasked = errorMessageMasked;
    }

    public String getErrorType() {
        return this.errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    public String getExitCode() {
        return this.exitCode;
    }

    public void setExitCode(String exitCode) {
        this.exitCode = exitCode;
    }

    public String getFinishReason() {
        return this.finishReason;
    }

    public void setFinishReason(String finishReason) {
        this.finishReason = finishReason;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInvocationNo() {
        return this.invocationNo;
    }

    public void setInvocationNo(String invocationNo) {
        this.invocationNo = invocationNo;
    }

    public String getInvocationType() {
        return this.invocationType;
    }

    public void setInvocationType(String invocationType) {
        this.invocationType = invocationType;
    }

    public String getLatencyMs() {
        return this.latencyMs;
    }

    public void setLatencyMs(String latencyMs) {
        this.latencyMs = latencyMs;
    }

    public Boolean getLegalHold() {
        return this.legalHold;
    }

    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPayloadHash() {
        return this.payloadHash;
    }

    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getPermissionMode() {
        return this.permissionMode;
    }

    public void setPermissionMode(String permissionMode) {
        this.permissionMode = permissionMode;
    }

    public String getProvider() {
        return this.provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderConversationId() {
        return this.providerConversationId;
    }

    public void setProviderConversationId(String providerConversationId) {
        this.providerConversationId = providerConversationId;
    }

    public String getProviderResponseId() {
        return this.providerResponseId;
    }

    public void setProviderResponseId(String providerResponseId) {
        this.providerResponseId = providerResponseId;
    }

    public String getProviderSessionId() {
        return this.providerSessionId;
    }

    public void setProviderSessionId(String providerSessionId) {
        this.providerSessionId = providerSessionId;
    }

    public String getProviderStepId() {
        return this.providerStepId;
    }

    public void setProviderStepId(String providerStepId) {
        this.providerStepId = providerStepId;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public Map<String, String> getRequestJson() {
        return this.requestJson;
    }

    public void setRequestJson(Map<String, String> requestJson) {
        this.requestJson = requestJson;
    }

    public Map<String, String> getResponseJson() {
        return this.responseJson;
    }

    public void setResponseJson(Map<String, String> responseJson) {
        this.responseJson = responseJson;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }

    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getRuntime() {
        return this.runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public String getSandboxPolicy() {
        return this.sandboxPolicy;
    }

    public void setSandboxPolicy(String sandboxPolicy) {
        this.sandboxPolicy = sandboxPolicy;
    }

    public String getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(String startedAt) {
        this.startedAt = startedAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getToolCallId() {
        return this.toolCallId;
    }

    public void setToolCallId(String toolCallId) {
        this.toolCallId = toolCallId;
    }

    public String getToolName() {
        return this.toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }

    public String getTraceId() {
        return this.traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public String getTtftMs() {
        return this.ttftMs;
    }

    public void setTtftMs(String ttftMs) {
        this.ttftMs = ttftMs;
    }

    public Map<String, String> getUsageJson() {
        return this.usageJson;
    }

    public void setUsageJson(Map<String, String> usageJson) {
        this.usageJson = usageJson;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
