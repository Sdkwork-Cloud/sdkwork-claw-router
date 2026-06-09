package com.sdkwork.clawrouter.app.model;


public class OauthAuthorizationUrlsRetrieveResult {
    private String code;
    private IamOauthAuthorizationUrlResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamOauthAuthorizationUrlResponse getData() {
        return this.data;
    }

    public void setData(IamOauthAuthorizationUrlResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
