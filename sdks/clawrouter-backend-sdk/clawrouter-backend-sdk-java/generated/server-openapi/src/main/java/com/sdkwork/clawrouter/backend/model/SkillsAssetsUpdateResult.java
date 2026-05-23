package com.sdkwork.clawrouter.backend.model;


public class SkillsAssetsUpdateResult {
    private String code;
    private AdminSkillAssetMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillAssetMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillAssetMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
