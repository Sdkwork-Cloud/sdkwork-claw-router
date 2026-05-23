package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class WalletAccountsListResult {
    private String code;
    private List<CommerceWalletAccountItem> data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<CommerceWalletAccountItem> getData() {
        return this.data;
    }

    public void setData(List<CommerceWalletAccountItem> data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
