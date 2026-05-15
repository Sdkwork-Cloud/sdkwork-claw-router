package com.sdkwork.clawrouter.app.model;


public class CommerceVipPrivilegeSpeedUpRequest {
    private String privilegeCode;
    private String remarks;
    private String requestNo;

    public String getPrivilegeCode() {
        return this.privilegeCode;
    }
    
    public void setPrivilegeCode(String privilegeCode) {
        this.privilegeCode = privilegeCode;
    }

    public String getRemarks() {
        return this.remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getRequestNo() {
        return this.requestNo;
    }
    
    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }
}
