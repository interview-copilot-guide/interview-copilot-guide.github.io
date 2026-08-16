/**
 * Minimal Workers runtime declarations for `tsc --noEmit`.
 *
 * The full `@cloudflare/workers-types` package cannot be pulled in globally
 * here: it redeclares DOM globals such as `Body`, which then conflict with the
 * browser types the client components rely on. Only the names this project
 * actually touches are declared instead.
 */

/** Service binding used to serve static assets from the Worker. */
interface Fetcher {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}
