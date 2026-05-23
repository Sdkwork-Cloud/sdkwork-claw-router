package com.sdkwork.clawrouter.app.model;


public class CommentsReplyCreateResult {
    private String code;
    private ForumCommentItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public ForumCommentItem getData() {
        return this.data;
    }

    public void setData(ForumCommentItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
