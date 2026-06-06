package com.sdkwork.clawrouter.backend.model;


public class CommerceMembershipBenefitMutationRequest {
    private String benefitKey;
    private Boolean claimed;
    private String description;
    private MediaResource icon;
    private String id;
    private String name;
    private String type;
    private String usageLimit;
    private String usedCount;

    public String getBenefitKey() {
        return this.benefitKey;
    }

    public void setBenefitKey(String benefitKey) {
        this.benefitKey = benefitKey;
    }

    public Boolean getClaimed() {
        return this.claimed;
    }

    public void setClaimed(Boolean claimed) {
        this.claimed = claimed;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MediaResource getIcon() {
        return this.icon;
    }

    public void setIcon(MediaResource icon) {
        this.icon = icon;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsageLimit() {
        return this.usageLimit;
    }

    public void setUsageLimit(String usageLimit) {
        this.usageLimit = usageLimit;
    }

    public String getUsedCount() {
        return this.usedCount;
    }

    public void setUsedCount(String usedCount) {
        this.usedCount = usedCount;
    }
}
