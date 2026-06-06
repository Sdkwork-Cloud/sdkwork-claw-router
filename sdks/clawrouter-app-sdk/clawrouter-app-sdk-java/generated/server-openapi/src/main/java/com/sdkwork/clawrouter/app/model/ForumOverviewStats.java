package com.sdkwork.clawrouter.app.model;


public class ForumOverviewStats {
    private String memberCount;
    private String onlineMembers;
    private String totalComments;
    private String totalPosts;

    public String getMemberCount() {
        return this.memberCount;
    }

    public void setMemberCount(String memberCount) {
        this.memberCount = memberCount;
    }

    public String getOnlineMembers() {
        return this.onlineMembers;
    }

    public void setOnlineMembers(String onlineMembers) {
        this.onlineMembers = onlineMembers;
    }

    public String getTotalComments() {
        return this.totalComments;
    }

    public void setTotalComments(String totalComments) {
        this.totalComments = totalComments;
    }

    public String getTotalPosts() {
        return this.totalPosts;
    }

    public void setTotalPosts(String totalPosts) {
        this.totalPosts = totalPosts;
    }
}
