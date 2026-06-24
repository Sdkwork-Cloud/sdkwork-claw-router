import assert from 'node:assert/strict';
import test from 'node:test';
import {
  omitAuthProjectionBody,
  omitAuthProjectionQuery,
  requiresClientContextSelectorSanitization,
  sanitizeSdkHttpRequestOptions,
} from './auth-projection.ts';

test('omitAuthProjectionQuery removes tenant and subject selectors', () => {
  assert.deepEqual(
    omitAuthProjectionQuery({
      tenantId: 'tenant-1',
      page: '1',
      userId: 'user-1',
    }),
    { page: '1' },
  );
});

test('omitAuthProjectionBody removes tenant selector fields', () => {
  assert.deepEqual(
    omitAuthProjectionBody({
      tenantId: 'tenant-1',
      prompt: 'hello',
    }),
    { prompt: 'hello' },
  );
});

test('requiresClientContextSelectorSanitization guards app and open surfaces only', () => {
  assert.equal(requiresClientContextSelectorSanitization('/app/v3/api/drive/spaces'), true);
  assert.equal(requiresClientContextSelectorSanitization('/v1/chat/completions'), true);
  assert.equal(requiresClientContextSelectorSanitization('/backend/v3/api/ai/agents'), false);
});

test('sanitizeSdkHttpRequestOptions strips selectors for app API requests', () => {
  assert.deepEqual(
    sanitizeSdkHttpRequestOptions('/app/v3/api/generations/images/text-to-image', {
      method: 'POST',
      params: { tenantId: 'tenant-1', page: '1' },
      body: { tenantId: 'tenant-1', prompt: 'draw a cat' },
    }),
    {
      method: 'POST',
      params: { page: '1' },
      body: { prompt: 'draw a cat' },
    },
  );
});

test('sanitizeSdkHttpRequestOptions leaves backend admin filters intact', () => {
  assert.deepEqual(
    sanitizeSdkHttpRequestOptions('/backend/v3/api/ai/agents', {
      params: { tenantId: 'tenant-1', page: '1' },
    }),
    {
      params: { tenantId: 'tenant-1', page: '1' },
    },
  );
});
