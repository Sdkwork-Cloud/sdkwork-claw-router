package com.sdkwork.clawrouter.backend.model;


public class CommerceMembershipBenefitMutationRequest {
    private String benefitKey;
    private Boolean claimed;
    private String description;
    private MediaResource icon;
    private Integer id;
    private String name;
    private String type;
    private Integer usageLimit;
    private Integer usedCount;

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

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
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

    public Integer getUsageLimit() {
        return this.usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getUsedCount() {
        return this.usedCount;
    }

    public void setUsedCount(Integer usedCount) {
        this.usedCount = usedCount;
    }
}
