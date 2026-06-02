import { createIdempotencyParams, getClawRouterBackendSdkClient } from 'sdkwork-claw-router-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];

export async function listCommerceCategories(params?: Parameters<BackendCommerce['catalog']['categories']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.categories.list(params);
}

export async function listCommerceProducts(params?: Parameters<BackendCommerce['catalog']['products']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.products.list(params);
}

export async function listCommerceSkus(params?: Parameters<BackendCommerce['catalog']['skus']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.skus.list(params);
}

export async function listCommerceAttributes(params?: Parameters<BackendCommerce['catalog']['attributes']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.attributes.list(params);
}

export async function listCommerceCategoryAttributes(params?: Parameters<BackendCommerce['catalog']['categoryAttributes']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.categoryAttributes.list(params);
}

export async function listCommercePriceLists(params?: Parameters<BackendCommerce['catalog']['priceLists']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.priceLists.list(params);
}

export async function createCommerceCategory(body: Parameters<BackendCommerce['catalog']['categories']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.categories.create(
    body,
    createIdempotencyParams('backend-catalog-category-create'),
  );
}

export async function updateCommerceCategory(categoryId: string, body: Parameters<BackendCommerce['catalog']['categories']['update']>[1]) {
  return getClawRouterBackendSdkClient().commerce.catalog.categories.update(
    categoryId,
    body,
    createIdempotencyParams('backend-catalog-category-update'),
  );
}

export async function deleteCommerceCategory(categoryId: string) {
  return getClawRouterBackendSdkClient().commerce.catalog.categories.delete(categoryId);
}

export async function initializeCommerceCategorySeeds(body: Parameters<BackendCommerce['catalog']['categorySeeds']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.categorySeeds.create(
    body,
    createIdempotencyParams('backend-catalog-category-seeds-initialize'),
  );
}

export async function createCommerceProduct(body: Parameters<BackendCommerce['catalog']['products']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.products.create(
    body,
    createIdempotencyParams('backend-catalog-product-create'),
  );
}

export async function updateCommerceProduct(productId: string, body: Parameters<BackendCommerce['catalog']['products']['update']>[1]) {
  return getClawRouterBackendSdkClient().commerce.catalog.products.update(
    productId,
    body,
    createIdempotencyParams('backend-catalog-product-update'),
  );
}

export async function deleteCommerceProduct(productId: string) {
  return getClawRouterBackendSdkClient().commerce.catalog.products.delete(productId);
}

export async function createCommerceSku(body: Parameters<BackendCommerce['catalog']['skus']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.skus.create(
    body,
    createIdempotencyParams('backend-catalog-sku-create'),
  );
}

export async function updateCommerceSku(skuId: string, body: Parameters<BackendCommerce['catalog']['skus']['update']>[1]) {
  return getClawRouterBackendSdkClient().commerce.catalog.skus.update(
    skuId,
    body,
    createIdempotencyParams('backend-catalog-sku-update'),
  );
}

export async function deleteCommerceSku(skuId: string) {
  return getClawRouterBackendSdkClient().commerce.catalog.skus.delete(skuId);
}

export async function createCommerceAttribute(body: Parameters<BackendCommerce['catalog']['attributes']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.attributes.create(
    body,
    createIdempotencyParams('backend-catalog-attribute-create'),
  );
}

export async function createCommerceCategoryAttribute(body: Parameters<BackendCommerce['catalog']['categoryAttributes']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.categoryAttributes.create(
    body,
    createIdempotencyParams('backend-catalog-category-attribute-create'),
  );
}

export async function updateCommerceCategoryAttribute(
  bindingId: string,
  body: Parameters<BackendCommerce['catalog']['categoryAttributes']['update']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.catalog.categoryAttributes.update(
    bindingId,
    body,
    createIdempotencyParams('backend-catalog-category-attribute-update'),
  );
}

export async function deleteCommerceCategoryAttribute(bindingId: string) {
  return getClawRouterBackendSdkClient().commerce.catalog.categoryAttributes.delete(bindingId);
}

export async function createCommercePriceList(body: Parameters<BackendCommerce['catalog']['priceLists']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.catalog.priceLists.create(
    body,
    createIdempotencyParams('backend-catalog-price-list-create'),
  );
}
