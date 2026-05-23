package com.sdkwork.clawrouter.app.model;


public class CoursesListResult {
    private String code;
    private CourseListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CourseListResponse getData() {
        return this.data;
    }

    public void setData(CourseListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
