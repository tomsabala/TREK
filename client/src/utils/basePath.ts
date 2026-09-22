/** Mount prefix, compiled in by Vite's `base`. '/' when TREK owns the origin root. */
export const BASE: string = import.meta.env.BASE_URL || '/'

/** Same value without the trailing slash: '' at the root, '/a/trek' behind the gateway. */
export const BASE_NO_SLASH: string = BASE.replace(/\/$/, '')

/** Prefixes a root-absolute app path: withBase('/api') -> '/a/trek/api'. */
export function withBase(path: string): string {
  return BASE_NO_SLASH + (path.startsWith('/') ? path : `/${path}`)
}

/** Inverse: browser pathname -> the app-relative path route guards compare against. */
export function stripBase(pathname: string): string {
  if (!BASE_NO_SLASH) return pathname
  if (pathname === BASE_NO_SLASH) return '/'
  return pathname.startsWith(`${BASE_NO_SLASH}/`) ? pathname.slice(BASE_NO_SLASH.length) : pathname
}
