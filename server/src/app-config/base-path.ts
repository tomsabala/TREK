/**
 * The path prefix TREK is mounted under, e.g. '/a/trek' behind the apps gateway.
 *
 * Deliberately a standalone module rather than a readEnv() schema key: the
 * bootstrap mount and the WebSocket adapter run before/outside the config
 * pipeline, and a self-contained module keeps the upstream rebase surface to
 * one new file.
 *
 * Always leading-slash, never trailing. '' when TREK owns the origin root, so
 * every call site is a no-op concatenation in the default deployment.
 */
export function basePath(): string {
  const raw = (process.env.TREK_BASE_PATH ?? '').trim().replace(/\/+$/, '')
  if (!raw) return ''
  return raw.startsWith('/') ? raw : `/${raw}`
}

/** Prefixes a root-absolute path with the mount prefix. */
export function withBasePath(path: string): string {
  return `${basePath()}${path}`
}
