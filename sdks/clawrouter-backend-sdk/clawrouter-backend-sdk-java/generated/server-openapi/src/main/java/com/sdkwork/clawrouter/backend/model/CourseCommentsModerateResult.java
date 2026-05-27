package com.sdkwork.clawrouter.backend.model;


public class CourseCommentsModerateResult {
    private String code;
    private AdminCourseCommentCollectionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminCourseCommentCollectionResponse getData() {
        return this.data;
    }

    public void setData(AdminCourseCommentCollectionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
