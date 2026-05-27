package com.sdkwork.clawrouter.backend.model;


public class CoursesRelationsReplaceResult {
    private String code;
    private AdminCourseRelationCollectionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminCourseRelationCollectionResponse getData() {
        return this.data;
    }

    public void setData(AdminCourseRelationCollectionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
