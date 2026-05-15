#!/usr/bin/env node

import { existsSync } from 'node:fs';
import path from 'node:path';

function findSpringAiPlusBusinessAppsRoot(startPath) {
  let current = path.resolve(startPath);
  while (true) {
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    const candidate = path.join(parent, 'spring-ai-plus-business', 'apps');
    if (existsSync(candidate)) {
      return candidate;
    }
    current = parent;
  }
  return null;
}

export function resolveClawRouterBusinessAppsRoot(startPath = path.resolve(import.meta.dirname, '..')) {
  return findSpringAiPlusBusinessAppsRoot(startPath) ?? path.resolve(startPath, '..');
}

export function resolveClawRouterBusinessRoot(startPath = path.resolve(import.meta.dirname, '..')) {
  return path.dirname(resolveClawRouterBusinessAppsRoot(startPath));
}

export function resolveClawRouterBusinessSpecsRoot(startPath = path.resolve(import.meta.dirname, '..')) {
  return path.join(resolveClawRouterBusinessRoot(startPath), 'specs');
}
