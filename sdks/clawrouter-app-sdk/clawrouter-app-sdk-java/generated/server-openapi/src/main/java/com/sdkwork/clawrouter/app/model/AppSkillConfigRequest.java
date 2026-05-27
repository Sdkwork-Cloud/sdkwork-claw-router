package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AppSkillConfigRequest {
    private Map<String, String> config;

    public Map<String, String> getConfig() {
        return this.config;
    }

    public void setConfig(Map<String, String> config) {
        this.config = config;
    }
}
