package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamDepartmentListResponse {
    private List<IamDepartmentItem> items;

    public List<IamDepartmentItem> getItems() {
        return this.items;
    }

    public void setItems(List<IamDepartmentItem> items) {
        this.items = items;
    }
}
