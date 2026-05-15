package com.sdkwork.clawrouter.app.model;


public class ForumAuthor {
    private String avatar;
    private String bio;
    private Integer id;
    private Boolean isFollowing;
    private String name;

    public String getAvatar() {
        return this.avatar;
    }
    
    public void setAvatar(String avatar) {
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
