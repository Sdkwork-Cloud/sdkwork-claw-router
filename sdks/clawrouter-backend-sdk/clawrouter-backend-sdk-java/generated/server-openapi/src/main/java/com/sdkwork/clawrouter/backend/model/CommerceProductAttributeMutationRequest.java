package com.sdkwork.clawrouter.backend.model;


public class CommerceProductAttributeMutationRequest {
    private String attributeNo;
    private Boolean filterable;
    private String name;
    private Boolean required;
    private String scope;
    private Boolean searchable;
    private String status;
    private String valueType;

    public String getAttributeNo() {
        return this.attributeNo;
    }

    public void setAttributeNo(String attributeNo) {
        this.attributeNo = attributeNo;
    }

    public Boolean getFilterable() {
        return this.filterable;
    }

    public void setFilterable(Boolean filterable) {
        this.filterable = filterable;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getRequired() {
        return this.required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public String getScope() {
        return this.scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public Boolean getSearchable() {
        return this.searchable;
    }

    public void setSearchable(Boolean searchable) {
        this.searchable = searchable;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getValueType() {
        return this.valueType;
    }

    public void setValueType(String valueType) {
        this.valueType = valueType;
    }
}
