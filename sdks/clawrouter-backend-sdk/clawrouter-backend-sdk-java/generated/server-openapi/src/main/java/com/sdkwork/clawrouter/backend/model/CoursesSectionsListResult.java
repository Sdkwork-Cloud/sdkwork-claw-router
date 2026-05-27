package com.sdkwork.clawrouter.backend.model;


public class CoursesSectionsListResult {
    private String code;
    private AdminCourseSectionCollectionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminCourseSectionCollectionResponse getData() {
        return this.data;
    }

    public void setData(AdminCourseSectionCollectionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
