package com.sdkwork.clawrouter.app.model;


public class ForumAuthor {
    private MediaResource avatar;
    private String bio;
    private Integer id;
    private Boolean isFollowing;
    private String name;

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

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getIsFollowing() {
        return this.isFollowing;
    }

    public void setIsFollowing(Boolean isFollowing) {
        this.isFollowing = isFollowing;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
