package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CommerceProductSpuItem {
    private String brand;
    private List<String> categoryIds;
    private String createdAt;
    private String currencyCode;
    private String defaultSkuId;
    private String description;
    private String id;
    private List<CommerceProductMediaItem> media;
    private String minPriceAmount;
    private String productType;
    private String publishedAt;
    private String spuNo;
    private String status;
    private String subtitle;
    private String title;
    private String updatedAt;

    public String getBrand() {
        return this.brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public List<String> getCategoryIds() {
        return this.categoryIds;
    }

    public void setCategoryIds(List<String> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getDefaultSkuId() {
        return this.defaultSkuId;
    }

    public void setDefaultSkuId(String defaultSkuId) {
        this.defaultSkuId = defaultSkuId;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<CommerceProductMediaItem> getMedia() {
        return this.media;
    }

    public void setMedia(List<CommerceProductMediaItem> media) {
        this.media = media;
    }

    public String getMinPriceAmount() {
        return this.minPriceAmount;
    }

    public void setMinPriceAmount(String minPriceAmount) {
        this.minPriceAmount = minPriceAmount;
    }

    public String getProductType() {
        return this.productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getSpuNo() {
        return this.spuNo;
    }

    public void setSpuNo(String spuNo) {
        this.spuNo = spuNo;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubtitle() {
        return this.subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
