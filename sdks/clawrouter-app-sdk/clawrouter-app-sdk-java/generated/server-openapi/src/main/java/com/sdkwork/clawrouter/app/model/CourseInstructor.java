package com.sdkwork.clawrouter.app.model;


public class CourseInstructor {
    private MediaResource avatar;
    private String bio;
    private String name;
    private String title;

    public MediaResource getAvatar() {
        return this.avatar;
    }

    public void setAvatar(MediaResource avatar) {
        this.avatar = avatar;
    }

    public String getBio() {
        return this.bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
