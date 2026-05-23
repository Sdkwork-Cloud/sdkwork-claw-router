package com.sdkwork.clawrouter.backend.model;


public class AdminAnalyticsSummary {
    private Integer activeModels;
    private Integer activeUsers;
    private Double averagePointsPerRequest;
    private Double averageTokensPerRequest;
    private Double errorRate;
    private Integer failedRequests;
    private Integer successfulRequests;
    private Double totalPoints;
    private Integer totalRequests;
    private Double totalTokens;
    private Integer totalUsers;
    private Double upstreamCost;

    public Integer getActiveModels() {
        return this.activeModels;
    }

    public void setActiveModels(Integer activeModels) {
        this.activeModels = activeModels;
    }

    public Integer getActiveUsers() {
        return this.activeUsers;
    }

    public void setActiveUsers(Integer activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Double getAveragePointsPerRequest() {
        return this.averagePointsPerRequest;
    }

    public void setAveragePointsPerRequest(Double averagePointsPerRequest) {
        this.averagePointsPerRequest = averagePointsPerRequest;
    }

    public Double getAverageTokensPerRequest() {
        return this.averageTokensPerRequest;
    }

    public void setAverageTokensPerRequest(Double averageTokensPerRequest) {
        this.averageTokensPerRequest = averageTokensPerRequest;
    }

    public Double getErrorRate() {
        return this.errorRate;
    }

    public void setErrorRate(Double errorRate) {
        this.errorRate = errorRate;
    }

    public Integer getFailedRequests() {
        return this.failedRequests;
    }

    public void setFailedRequests(Integer failedRequests) {
        this.failedRequests = failedRequests;
    }

    public Integer getSuccessfulRequests() {
        return this.successfulRequests;
    }

    public void setSuccessfulRequests(Integer successfulRequests) {
        this.successfulRequests = successfulRequests;
    }

    public Double getTotalPoints() {
        return this.totalPoints;
    }

    public void setTotalPoints(Double totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Integer getTotalRequests() {
        return this.totalRequests;
    }

    public void setTotalRequests(Integer totalRequests) {
        this.totalRequests = totalRequests;
    }

    public Double getTotalTokens() {
        return this.totalTokens;
    }

    public void setTotalTokens(Double totalTokens) {
        this.totalTokens = totalTokens;
    }

    public Integer getTotalUsers() {
        return this.totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Double getUpstreamCost() {
        return this.upstreamCost;
    }

    public void setUpstreamCost(Double upstreamCost) {
        this.upstreamCost = upstreamCost;
    }
}
