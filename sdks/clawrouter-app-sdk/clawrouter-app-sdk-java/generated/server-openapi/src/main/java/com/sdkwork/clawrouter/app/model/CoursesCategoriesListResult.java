package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CoursesCategoriesListResult {
    private String code;
    private List<CourseCategoryItem> data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<CourseCategoryItem> getData() {
        return this.data;
    }

    public void setData(List<CourseCategoryItem> data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
