package com.sdkwork.clawrouter.app.model;


public class CoursesRetrieveResult {
    private String code;
    private CourseDetail data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public CourseDetail getData() {
        return this.data;
    }
    
    public void setData(CourseDetail data) {
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
