package com.sdkwork.clawrouter.app.model;


public class GenerationAgentRunCreateRequest {
    private String prompt;
    private String selectedModel;

    public String getPrompt() {
        return this.prompt;
    }
    
    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getSelectedModel() {
        return this.selectedModel;
    }
    
    public void setSelectedModel(String selectedModel) {
        this.selectedModel = selectedModel;
    }
}
