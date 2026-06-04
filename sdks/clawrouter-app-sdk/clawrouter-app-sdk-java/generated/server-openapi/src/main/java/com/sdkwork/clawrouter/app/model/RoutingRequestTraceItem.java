package com.sdkwork.clawrouter.app.model;


public class RoutingRequestTraceItem {
    private String channel;
    private String duration;
    private String endedAt;
    private String errorMessageMasked;
    private String errorType;
    private String httpMethod;
    private String id;
    private String model;
    private String providerErrorCode;
    private Integer requestBytes;
    private String requestId;
    private String requestPath;
    private String requestPayloadHash;
    private Integer responseBytes;
    private String responsePayloadHash;
    private String startedAt;
    private Integer status;
    private Boolean streaming;
    private String time;
    private Integer tokens;
    private String traceId;

    public String getChannel() {
        return this.channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getDuration() {
        return this.duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getEndedAt() {
        return this.endedAt;
    }

    public void setEndedAt(String endedAt) {
        this.endedAt = endedAt;
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

    public String getHttpMethod() {
        return this.httpMethod;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getProviderErrorCode() {
        return this.providerErrorCode;
    }

    public void setProviderErrorCode(String providerErrorCode) {
        this.providerErrorCode = providerErrorCode;
    }

    public Integer getRequestBytes() {
        return this.requestBytes;
    }

    public void setRequestBytes(Integer requestBytes) {
        this.requestBytes = requestBytes;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRequestPath() {
        return this.requestPath;
    }

    public void setRequestPath(String requestPath) {
        this.requestPath = requestPath;
    }

    public String getRequestPayloadHash() {
        return this.requestPayloadHash;
    }

    public void setRequestPayloadHash(String requestPayloadHash) {
        this.requestPayloadHash = requestPayloadHash;
    }

    public Integer getResponseBytes() {
        return this.responseBytes;
    }

    public void setResponseBytes(Integer responseBytes) {
        this.responseBytes = responseBytes;
    }

    public String getResponsePayloadHash() {
        return this.responsePayloadHash;
    }

    public void setResponsePayloadHash(String responsePayloadHash) {
        this.responsePayloadHash = responsePayloadHash;
    }

    public String getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(String startedAt) {
        this.startedAt = startedAt;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Boolean getStreaming() {
        return this.streaming;
    }

    public void setStreaming(Boolean streaming) {
        this.streaming = streaming;
    }

    public String getTime() {
        return this.time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Integer getTokens() {
        return this.tokens;
    }

    public void setTokens(Integer tokens) {
        this.tokens = tokens;
    }

    public String getTraceId() {
        return this.traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }
}
