package com.sdkwork.clawrouter.app.model;


public class WalletTransactionsRetrieveResult {
    private String code;
    private CommerceWalletTransactionItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceWalletTransactionItem getData() {
        return this.data;
    }

    public void setData(CommerceWalletTransactionItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
