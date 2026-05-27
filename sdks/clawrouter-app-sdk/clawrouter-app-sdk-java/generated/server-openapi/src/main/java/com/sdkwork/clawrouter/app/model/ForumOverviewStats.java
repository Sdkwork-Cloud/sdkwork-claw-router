package com.sdkwork.clawrouter.app.model;


public class ForumOverviewStats {
    private Integer memberCount;
    private Integer onlineMembers;
    private Integer totalComments;
    private Integer totalPosts;

    public Integer getMemberCount() {
        return this.memberCount;
    }

    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }

    public Integer getOnlineMembers() {
        return this.onlineMembers;
    }

    public void setOnlineMembers(Integer onlineMembers) {
        this.onlineMembers = onlineMembers;
    }

    public Integer getTotalComments() {
        return this.totalComments;
    }

    public void setTotalComments(Integer totalComments) {
        this.totalComments = totalComments;
    }

    public Integer getTotalPosts() {
        return this.totalPosts;
    }

    public void setTotalPosts(Integer totalPosts) {
        this.totalPosts = totalPosts;
    }
}
