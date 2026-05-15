package com.sdkwork.clawrouter.app.model;


public class CourseOverview {
    private CourseOverviewSource source;
    private CourseOverviewStats stats;

    public CourseOverviewSource getSource() {
        return this.source;
    }
    
    public void setSource(CourseOverviewSource source) {
        this.source = source;
    }

    public CourseOverviewStats getStats() {
        return this.stats;
    }
    
    public void setStats(CourseOverviewStats stats) {
        this.stats = stats;
    }
}
