package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ForumOverviewResponse {
    private List<ForumCommunityLink> communityLinks;
    private ForumOverviewSource source;
    private ForumOverviewStats stats;

    public List<ForumCommunityLink> getCommunityLinks() {
        return this.communityLinks;
    }
    
    public void setCommunityLinks(List<ForumCommunityLink> communityLinks) {
        this.communityLinks = communityLinks;
    }

    public ForumOverviewSource getSource() {
        return this.source;
    }
    
    public void setSource(ForumOverviewSource source) {
        this.source = source;
    }

    public ForumOverviewStats getStats() {
        return this.stats;
    }
    
    public void setStats(ForumOverviewStats stats) {
        this.stats = stats;
    }
}
