package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminRecordLogsResponse {
    private List<AdminRecordLogItem> logs;
    private Integer page;
    private Integer pageSize;
    private Integer total;

    public List<AdminRecordLogItem> getLogs() {
        return this.logs;
    }

    public void setLogs(List<AdminRecordLogItem> logs) {
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
