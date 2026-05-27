package com.sdkwork.clawrouter.backend.model;


public class CoursesListResult {
    private String code;
    private AdminCourseCollectionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminCourseCollectionResponse getData() {
        return this.data;
    }

    public void setData(AdminCourseCollectionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
