package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class UsageLogsResponse {
    private List<UsageLogItem> logs;
    private Integer page;
    private Integer pageSize;
    private Integer total;

    public List<UsageLogItem> getLogs() {
        return this.logs;
    }

    public void setLogs(List<UsageLogItem> logs) {
        this.logs = logs;
    }

    public Integer getPage() {
        return this.page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return this.pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getTotal() {
        return this.total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
