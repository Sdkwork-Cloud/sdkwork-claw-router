package com.sdkwork.clawrouter.backend.model;


public class CommerceProductCategoryAttributeMutationRequest {
    private String attributeId;
    private String categoryId;
    private Boolean filterable;
    private Boolean required;
    private Boolean searchable;
    private String sortOrder;
    private String status;

    public String getAttributeId() {
        return this.attributeId;
    }

    public void setAttributeId(String attributeId) {
        this.attributeId = attributeId;
    }

    public String getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public Boolean getFilterable() {
        return this.filterable;
    }

    public void setFilterable(Boolean filterable) {
        this.filterable = filterable;
    }

    public Boolean getRequired() {
        return this.required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Boolean getSearchable() {
        return this.searchable;
    }

    public void setSearchable(Boolean searchable) {
        this.searchable = searchable;
    }

    public String getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
