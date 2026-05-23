package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AgentSessionCreateRequest {
    private String agentVersionId;
    private String approvalPolicy;
    private String chatConversationId;
    private String cwd;
    private String defaultModel;
    private String memorySpaceId;
    private Map<String, String> metadata;
    private String permissionMode;
    private String runtime;
    private String sandboxPolicy;
    private String sessionKind;
    private String sourceSurface;
    private String title;

    public String getAgentVersionId() {
        return this.agentVersionId;
    }

    public void setAgentVersionId(String agentVersionId) {
        this.agentVersionId = agentVersionId;
    }

    public String getApprovalPolicy() {
        return this.approvalPolicy;
    }

    public void setApprovalPolicy(String approvalPolicy) {
        this.approvalPolicy = approvalPolicy;
    }

    public String getChatConversationId() {
        return this.chatConversationId;
    }

    public void setChatConversationId(String chatConversationId) {
        this.chatConversationId = chatConversationId;
    }

    public String getCwd() {
        return this.cwd;
    }

    public void setCwd(String cwd) {
        this.cwd = cwd;
    }

    public String getDefaultModel() {
        return this.defaultModel;
    }

    public void setDefaultModel(String defaultModel) {
        this.defaultModel = defaultModel;
    }

    public String getMemorySpaceId() {
        return this.memorySpaceId;
    }

    public void setMemorySpaceId(String memorySpaceId) {
        this.memorySpaceId = memorySpaceId;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getPermissionMode() {
        return this.permissionMode;
    }

    public void setPermissionMode(String permissionMode) {
        this.permissionMode = permissionMode;
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

    public String getSessionKind() {
        return this.sessionKind;
    }

    public void setSessionKind(String sessionKind) {
        this.sessionKind = sessionKind;
    }

    public String getSourceSurface() {
        return this.sourceSurface;
    }

    public void setSourceSurface(String sourceSurface) {
        this.sourceSurface = sourceSurface;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
