/**
 * Thin HTTP client for the ChatGenius REST API. One method: call(tool, args).
 * Splits the flat tool arguments back into path, query and body the way the
 * spec declares them, adds the key and an Idempotency-Key on every write,
 * and turns API errors into a plain {code, message, param, status} object.
 */
import { randomUUID } from 'node:crypto';

export class ApiError extends Error {
  constructor(status, code, message, param, headers) {
    super(message);
    this.status = status;
    this.code = code;
    this.param = param;
    this.retryAfter = headers?.get?.('retry-after') || null;
  }
}

export class ChatGeniusClient {
  constructor({ apiKey, baseUrl = 'https://sumgenius.ai/api/v1', userAgent = 'chatgenius-mcp' } = {}) {
    if (!apiKey) throw new Error('CHATGENIUS_API_KEY is not set.');
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.userAgent = userAgent;
  }

  async call(tool, args = {}) {
    let path = tool.path;
    const query = new URLSearchParams();
    const body = {};
    for (const [k, v] of Object.entries(args)) {
      if (v === undefined) continue;
      if (tool.where.path.includes(k)) {
        path = path.replace(`{${k}}`, encodeURIComponent(String(v)));
      } else if (tool.where.query.includes(k)) {
        if (Array.isArray(v)) v.forEach((x) => query.append(`${k}[]`, String(x)));
        else query.set(k, String(v));
      } else {
        body[k] = v;
      }
    }
    const unresolved = path.match(/\{(\w+)\}/);
    if (unresolved) throw new ApiError(400, 'invalid_param', `${unresolved[1]} is required.`, unresolved[1]);

    const url = this.baseUrl + path + (query.size ? '?' + query.toString() : '');
    const write = tool.method !== 'GET';
    const headers = {
      'X-SumGenius-Api-Key': this.apiKey,
      'Accept': 'application/json',
      'User-Agent': this.userAgent,
    };
    const init = { method: tool.method, headers };
    if (write) {
      headers['Content-Type'] = 'application/json';
      headers['Idempotency-Key'] = randomUUID();
      // Every write sends a JSON body, even an empty one: a bodiless POST is refused upstream.
      init.body = JSON.stringify(tool.hasBody ? body : {});
    }

    const res = await fetch(url, init);
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON body, handled below */ }

    if (!res.ok) {
      const e = json?.error || {};
      throw new ApiError(res.status, e.code || `http_${res.status}`, e.message || text.slice(0, 300) || res.statusText, e.param, res.headers);
    }
    return json ?? {};
  }
}
