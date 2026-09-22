import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { readEnv } from '../../app-config';
import { PUBLIC_DIR } from './platform.routes';

/**
 * Serves the built SPA (index.html) for any request the NestJS router did not
 * match — the production single-page-app fallback. This replaces the legacy
 * Express `app.get('*')` catch-all, which cannot run on the Nest instance: Nest's
 * router terminates an unmatched request by throwing NotFoundException (it never
 * falls through to a post-init Express route), so the SPA fallback has to live
 * inside the Nest pipeline as a NotFound filter instead.
 *
 * Behaviour matches the legacy catch-all exactly: in production, an unmatched GET
 * returns index.html; everything else (non-GET, or dev where there is no built
 * client) keeps the standard TREK `{ error }` 404 envelope. The `@Catch(NotFoundException)`
 * is more specific than the global TrekExceptionFilter, so Nest routes 404s here
 * while every other error still flows through TrekExceptionFilter.
 */
@Catch(NotFoundException)
export class SpaFallbackFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Case-sensitive on purpose (legacy parity).
    //
    // Explicit { root } + basename, not the absolute path: under the Nest
    // ExpressAdapter — and under the TREK_BASE_PATH sub-app mount, which
    // rewrites req.url — res.sendFile(absolutePath) resolves against the
    // rewritten url and 404s spuriously (same trap as
    // files-download.controller.ts).
    //
    // API and uploads misses keep their real 404: answering them with the SPA
    // shell turns a missing endpoint or a missing file into an HTML body the
    // client parses as JSON.
    if (
      readEnv().app.nodeEnv === 'production' &&
      req.method === 'GET' &&
      !req.path.startsWith('/api/') &&
      !req.path.startsWith('/uploads/')
    ) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile('index.html', { root: PUBLIC_DIR });
      return;
    }

    // Non-production, or a non-GET miss: keep the standard TREK 404 envelope
    // (identical to what TrekExceptionFilter produces for a NotFoundException).
    res.status(404).json({ error: exception.message || 'Not Found' });
  }
}
