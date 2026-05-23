package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class MemoryEntryCreateRequest {
    private String confidenceScore;
    private String content;
    private Map<String, String> contentJson;
    private String importanceScore;
    private String memoryType;
    private Map<String, String> metadata;
    private String sensitivityLevel;
    private String sourceConversationId;
    private String sourceInvocationId;
    private String sourceItemId;
    private String sourceKind;
    private String sourceTurnId;
    private String status;
    private String subjectKey;
    private String subjectType;
    private String trustLevel;

    public String getConfidenceScore() {
        return this.confidenceScore;
    }

    public void setConfidenceScore(String confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Map<String, String> getContentJson() {
        return this.contentJson;
    }

    public void setContentJson(Map<String, String> contentJson) {
        this.contentJson = contentJson;
    }

    public String getImportanceScore() {
        return this.importanceScore;
    }

    public void setImportanceScore(String importanceScore) {
        this.importanceScore = importanceScore;
    }

    public String getMemoryType() {
        return this.memoryType;
    }

    public void setMemoryType(String memoryType) {
        this.memoryType = memoryType;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getSensitivityLevel() {
        return this.sensitivityLevel;
    }

    public void setSensitivityLevel(String sensitivityLevel) {
        this.sensitivityLevel = sensitivityLevel;
    }

    public String getSourceConversationId() {
        return this.sourceConversationId;
    }

    public void setSourceConversationId(String sourceConversationId) {
        this.sourceConversationId = sourceConversationId;
    }

    public String getSourceInvocationId() {
        return this.sourceInvocationId;
    }

    public void setSourceInvocationId(String sourceInvocationId) {
        this.sourceInvocationId = sourceInvocationId;
    }

    public String getSourceItemId() {
        return this.sourceItemId;
    }

    public void setSourceItemId(String sourceItemId) {
        this.sourceItemId = sourceItemId;
    }

    public String getSourceKind() {
        return this.sourceKind;
    }

    public void setSourceKind(String sourceKind) {
        this.sourceKind = sourceKind;
    }

    public String getSourceTurnId() {
        return this.sourceTurnId;
    }

    public void setSourceTurnId(String sourceTurnId) {
        this.sourceTurnId = sourceTurnId;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubjectKey() {
        return this.subjectKey;
    }

    public void setSubjectKey(String subjectKey) {
        this.subjectKey = subjectKey;
    }

    public String getSubjectType() {
        return this.subjectType;
    }

    public void setSubjectType(String subjectType) {
        this.subjectType = subjectType;
    }

    public String getTrustLevel() {
        return this.trustLevel;
    }

    public void setTrustLevel(String trustLevel) {
        this.trustLevel = trustLevel;
    }
}
