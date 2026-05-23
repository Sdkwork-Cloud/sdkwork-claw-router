package com.sdkwork.clawrouter.app.model;


public class FeedsLikesCreateResult {
    private String code;
    private ForumFeedItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public ForumFeedItem getData() {
        return this.data;
    }

    public void setData(ForumFeedItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
