package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamDepartmentAssignmentListResponse {
    private List<IamDepartmentAssignmentItem> items;

    public List<IamDepartmentAssignmentItem> getItems() {
        return this.items;
    }

    public void setItems(List<IamDepartmentAssignmentItem> items) {
        this.items = items;
    }
}
