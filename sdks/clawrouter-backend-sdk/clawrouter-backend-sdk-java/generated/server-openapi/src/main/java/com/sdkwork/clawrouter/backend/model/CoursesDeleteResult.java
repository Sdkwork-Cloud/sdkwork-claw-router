package com.sdkwork.clawrouter.backend.model;


public class CoursesDeleteResult {
    private String code;
    private AdminCourseDeleteResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminCourseDeleteResponse getData() {
        return this.data;
    }

    public void setData(AdminCourseDeleteResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
