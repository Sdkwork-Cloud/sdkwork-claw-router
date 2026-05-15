package com.sdkwork.clawrouter.app.model;


public class CourseCategoryItem {
    private String code;
    private Integer courseCount;
    private String description;
    private String icon;
    private String id;
    private String label;
    private String name;
    private Integer sortWeight;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public Integer getCourseCount() {
        return this.courseCount;
    }
    
    public void setCourseCount(Integer courseCount) {
        this.courseCount = courseCount;
    }

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return this.icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return this.label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public Integer getSortWeight() {
        return this.sortWeight;
    }
    
    public void setSortWeight(Integer sortWeight) {
        this.sortWeight = sortWeight;
    }
}
