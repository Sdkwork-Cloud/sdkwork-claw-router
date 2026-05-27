package com.sdkwork.clawrouter.backend.model;


public class CourseApplicationsReviewResult {
    private String code;
    private AdminCourseApplicationReviewResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminCourseApplicationReviewResponse getData() {
        return this.data;
    }

    public void setData(AdminCourseApplicationReviewResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
