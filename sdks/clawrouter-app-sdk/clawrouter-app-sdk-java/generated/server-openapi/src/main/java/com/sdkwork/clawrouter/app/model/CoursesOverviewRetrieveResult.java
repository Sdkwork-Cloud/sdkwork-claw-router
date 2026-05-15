package com.sdkwork.clawrouter.app.model;


public class CoursesOverviewRetrieveResult {
    private String code;
    private CourseOverview data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public CourseOverview getData() {
        return this.data;
    }
    
    public void setData(CourseOverview data) {
        this.data = data;
    }

    public String getMessage() {
        return this.message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }

    public String getMsg() {
        return this.msg;
    }
    
    public void setMsg(String msg) {
        this.msg = msg;
    }
}
