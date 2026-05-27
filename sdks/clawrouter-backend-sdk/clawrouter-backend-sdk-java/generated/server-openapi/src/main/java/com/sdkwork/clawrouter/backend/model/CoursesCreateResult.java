package com.sdkwork.clawrouter.backend.model;


public class CoursesCreateResult {
    private String code;
    private AdminCourseMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminCourseMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminCourseMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
