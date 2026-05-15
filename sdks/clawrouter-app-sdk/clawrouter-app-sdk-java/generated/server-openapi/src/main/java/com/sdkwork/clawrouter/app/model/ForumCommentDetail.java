package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ForumCommentDetail {
    private ForumAuthor author;
    private String commentId;
    private String content;
    private Integer contentId;
    private String contentType;
    private String createdAt;
    private String deviceInfo;
    private String ipAddress;
    private Boolean isTop;
    private Integer likes;
    private Integer parentId;
    private List<ForumCommentItem> replies;
    private Integer replyCount;
    private String status;
    private String updatedAt;
    private Integer userId;

    public ForumAuthor getAuthor() {
        return this.author;
    }
    
    public void setAuthor(ForumAuthor author) {
        this.author = author;
    }

    public String getCommentId() {
        return this.commentId;
    }
    
    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getContent() {
        return this.content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }

    public Integer getContentId() {
        return this.contentId;
    }
    
    public void setContentId(Integer contentId) {
        this.contentId = contentId;
    }

    public String getContentType() {
        return this.contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDeviceInfo() {
        return this.deviceInfo;
    }
    
    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getIpAddress() {
        return this.ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Boolean getIsTop() {
        return this.isTop;
    }
    
    public void setIsTop(Boolean isTop) {
        this.isTop = isTop;
    }

    public Integer getLikes() {
        return this.likes;
    }
    
    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getParentId() {
        return this.parentId;
    }
    
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public List<ForumCommentItem> getReplies() {
        return this.replies;
    }
    
    public void setReplies(List<ForumCommentItem> replies) {
        this.replies = replies;
    }

    public Integer getReplyCount() {
        return this.replyCount;
    }
    
    public void setReplyCount(Integer replyCount) {
        this.replyCount = replyCount;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }
    
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getUserId() {
        return this.userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
