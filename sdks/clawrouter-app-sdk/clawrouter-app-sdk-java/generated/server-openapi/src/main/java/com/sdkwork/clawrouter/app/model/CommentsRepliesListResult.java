package com.sdkwork.clawrouter.app.model;


public class CommentsRepliesListResult {
    private String code;
    private ForumCommentPage data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public ForumCommentPage getData() {
        return this.data;
    }

    public void setData(ForumCommentPage data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
