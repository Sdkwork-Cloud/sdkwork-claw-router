package com.sdkwork.clawrouter.backend.model;


public class SkillsAssetsListResult {
    private String code;
    private AdminSkillAssetListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillAssetListResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillAssetListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
