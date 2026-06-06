package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ForumFeedItem {
    private ForumAuthor author;
    private String categoryId;
    private String commentCount;
    private String content;
    private String contentType;
    private MediaResource cover;
    private String createdAt;
    private String id;
    private Boolean isCollected;
    private Boolean isHot;
    private Boolean isLiked;
    private Boolean isRecommended;
    private Boolean isTop;
    private String likeCount;
    private String shareCount;
    private String summary;
    private List<String> tags;
    private String title;
    private String updatedAt;
    private String viewCount;

    public ForumAuthor getAuthor() {
        return this.author;
    }

    public void setAuthor(ForumAuthor author) {
        this.author = author;
    }

    public String getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCommentCount() {
        return this.commentCount;
    }

    public void setCommentCount(String commentCount) {
        this.commentCount = commentCount;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentType() {
        return this.contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public MediaResource getCover() {
        return this.cover;
    }

    public void setCover(MediaResource cover) {
        this.cover = cover;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getIsCollected() {
        return this.isCollected;
    }

    public void setIsCollected(Boolean isCollected) {
        this.isCollected = isCollected;
    }

    public Boolean getIsHot() {
        return this.isHot;
    }

    public void setIsHot(Boolean isHot) {
        this.isHot = isHot;
    }

    public Boolean getIsLiked() {
        return this.isLiked;
    }

    public void setIsLiked(Boolean isLiked) {
        this.isLiked = isLiked;
    }

    public Boolean getIsRecommended() {
        return this.isRecommended;
    }

    public void setIsRecommended(Boolean isRecommended) {
        this.isRecommended = isRecommended;
    }

    public Boolean getIsTop() {
        return this.isTop;
    }

    public void setIsTop(Boolean isTop) {
        this.isTop = isTop;
    }

    public String getLikeCount() {
        return this.likeCount;
    }

    public void setLikeCount(String likeCount) {
        this.likeCount = likeCount;
    }

    public String getShareCount() {
        return this.shareCount;
    }

    public void setShareCount(String shareCount) {
        this.shareCount = shareCount;
    }

    public String getSummary() {
        return this.summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getTags() {
        return this.tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getViewCount() {
        return this.viewCount;
    }

    public void setViewCount(String viewCount) {
        this.viewCount = viewCount;
    }
}
