package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommerceMembershipPlanMutationRequest {
    private List<CommerceMembershipBenefitMutationRequest> benefits;
    private String code;
    private String name;
    private String rank;
    private String status;

    public List<CommerceMembershipBenefitMutationRequest> getBenefits() {
        return this.benefits;
    }

    public void setBenefits(List<CommerceMembershipBenefitMutationRequest> benefits) {
        this.benefits = benefits;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRank() {
        return this.rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
