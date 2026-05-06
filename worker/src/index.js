const MAX_BODY_BYTES = 8192;
const MAX_TOKEN_LENGTH = 256;
const DEFAULT_RETENTION_DAYS = 90;
const DEFAULT_MAX_ADMIN_ROWS = 500;
const TRANSPARENT_GIF = Uint8Array.from([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0,
  255, 255, 255, 33, 249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0,
  1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return handleOptions(request, env);
    }

    if (url.pathname === "/collect") {
      return handleCollect(request, env);
    }

    if (url.pathname === "/collect.gif") {
      return handlePixelCollect(request, env);
    }

    if (url.pathname === "/admin") {
      return handleAdmin(request, env);
    }

    if (url.pathname === "/api/visits") {
      return handleVisitsApi(request, env);
    }

    if (url.pathname === "/health") {
      return jsonResponse({ ok: true });
    }

    return new Response("Not found", { status: 404 });
  }
};

async function handleCollect(request, env) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const origin = request.headers.get("Origin") || "";
  if (!isAllowedOrigin(origin, env)) {
    return new Response("Forbidden", {
      status: 403,
      headers: corsHeaders(origin, env)
    });
  }

  const bodyText = await readLimitedBody(request, MAX_BODY_BYTES);
  if (bodyText === null) {
    return new Response("Payload too large", {
      status: 413,
      headers: corsHeaders(origin, env)
    });
  }

  let payload = {};
  try {
    payload = JSON.parse(bodyText || "{}");
  } catch (error) {
    return new Response("Invalid JSON", {
      status: 400,
      headers: corsHeaders(origin, env)
    });
  }

  await saveVisitRecord(request, env, payload, "post");

  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, env)
  });
}

async function handlePixelCollect(request, env) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!isAllowedPixelSource(request, env)) {
    return new Response("Forbidden", {
      status: 403,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }

  const url = new URL(request.url);
  const payload = Object.fromEntries(url.searchParams.entries());
  payload.eventType = "pageview";
  await saveVisitRecord(request, env, payload, "pixel");

  return new Response(TRANSPARENT_GIF, {
    status: 200,
    headers: pixelHeaders()
  });
}

async function handleAdmin(request, env) {
  const auth = await authorize(request, env);
  if (!auth.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await loadVisitRows(env);
  const aggregates = aggregateByIp(rows);

  return new Response(renderAdminHtml(aggregates, rows.length), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

async function handleVisitsApi(request, env) {
  const auth = await authorize(request, env);
  if (!auth.ok) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const rows = await loadVisitRows(env);
  return jsonResponse({
    totalEventsLoaded: rows.length,
    retentionDays: retentionDays(env),
    visitors: aggregateByIp(rows)
  });
}

function handleOptions(request, env) {
  const origin = request.headers.get("Origin") || "";
  if (!isAllowedOrigin(origin, env)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, env)
  });
}

async function loadVisitRows(env) {
  const maxRows = clampNumber(env.MAX_ADMIN_ROWS, DEFAULT_MAX_ADMIN_ROWS, 50, 2000);
  const keys = [];
  let cursor = undefined;

  do {
    const result = await env.VISIT_LOGS.list({
      prefix: "visit:",
      limit: Math.min(1000, maxRows - keys.length),
      cursor
    });
    keys.push(...result.keys);
    cursor = result.list_complete ? undefined : result.cursor;
  } while (cursor && keys.length < maxRows);

  const values = await Promise.all(
    keys.slice(0, maxRows).map(async (key) => {
      const value = await env.VISIT_LOGS.get(key.name, "json");
      return value;
    })
  );

  return values
    .filter(Boolean)
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

function aggregateByIp(rows) {
  const visitors = new Map();

  for (const row of rows) {
    const ip = row.ip || "unknown";
    const existing = visitors.get(ip) || {
      ip,
      visitCount: 0,
      firstSeen: row.timestamp,
      lastSeen: row.timestamp,
      country: row.country || "",
      region: row.region || "",
      city: row.city || "",
      timezone: row.timezone || "",
      asn: row.asn || null,
      asOrganization: row.asOrganization || "",
      deviceType: row.deviceType || "",
      browser: row.browser || "",
      os: row.os || "",
      colorScheme: row.colorScheme || "",
      browserTimezone: row.browserTimezone || "",
      paths: new Set(),
      referrers: new Set(),
      seenPageviewIds: new Set(),
      linkClicks: new Map(),
      totalDurationSeconds: 0,
      durationEventCount: 0,
      lastUserAgent: row.userAgent || ""
    };

    if (!row.eventType || row.eventType === "pageview") {
      if (row.pageviewId) {
        const pageviewKey = String(row.pageviewId);
        if (!existing.seenPageviewIds.has(pageviewKey)) {
          existing.visitCount += 1;
          existing.seenPageviewIds.add(pageviewKey);
        }
      } else {
        existing.visitCount += 1;
      }
    }
    if (String(row.timestamp) < String(existing.firstSeen)) {
      existing.firstSeen = row.timestamp;
    }
    if (String(row.timestamp) > String(existing.lastSeen)) {
      existing.lastSeen = row.timestamp;
      existing.country = row.country || existing.country;
      existing.region = row.region || existing.region;
      existing.city = row.city || existing.city;
      existing.timezone = row.timezone || existing.timezone;
      existing.asn = row.asn || existing.asn;
      existing.asOrganization = row.asOrganization || existing.asOrganization;
      existing.deviceType = row.deviceType || existing.deviceType;
      existing.browser = row.browser || existing.browser;
      existing.os = row.os || existing.os;
      existing.colorScheme = row.colorScheme || existing.colorScheme;
      existing.browserTimezone = row.browserTimezone || existing.browserTimezone;
      existing.lastUserAgent = row.userAgent || existing.lastUserAgent;
    }
    if (row.path) {
      existing.paths.add(row.path);
    }
    if (row.referrer) {
      existing.referrers.add(row.referrer);
    }
    if (row.eventType === "link-click" && row.linkType) {
      existing.linkClicks.set(row.linkType, (existing.linkClicks.get(row.linkType) || 0) + 1);
    }
    if (row.eventType === "duration" && row.durationSeconds > 0) {
      existing.totalDurationSeconds += row.durationSeconds;
      existing.durationEventCount += 1;
    }

    visitors.set(ip, existing);
  }

  return Array.from(visitors.values())
    .map((visitor) => {
      const { seenPageviewIds, ...visibleVisitor } = visitor;
      return {
        ...visibleVisitor,
        paths: Array.from(visitor.paths).slice(0, 12),
        referrers: Array.from(visitor.referrers).slice(0, 12),
        linkClicks: Array.from(visitor.linkClicks.entries())
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
      };
    })
    .sort((a, b) => String(b.lastSeen).localeCompare(String(a.lastSeen)));
}

async function saveVisitRecord(request, env, payload, source) {
  const now = new Date();
  const record = buildVisitRecord(request, payload, now, source);
  const key = `visit:${now.toISOString().slice(0, 10)}:${now.getTime()}:${crypto.randomUUID()}`;
  await env.VISIT_LOGS.put(key, JSON.stringify(record), {
    expirationTtl: retentionSeconds(env)
  });
}

function buildVisitRecord(request, payload, now, source) {
  const cf = request.cf || {};
  const ip = request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown";

  const record = {
    timestamp: now.toISOString(),
    eventType: sanitize(payload.eventType || "pageview", 40),
    eventSource: sanitize(source, 20),
    pageviewId: sanitize(payload.pageviewId, 120),
    ip: sanitize(ip, 80),
    country: sanitize(cf.country, 80),
    region: sanitize(cf.region, 120),
    city: sanitize(cf.city, 120),
    timezone: sanitize(cf.timezone, 80),
    asn: typeof cf.asn === "number" ? cf.asn : null,
    asOrganization: sanitize(cf.asOrganization, 180),
    colo: sanitize(cf.colo, 20),
    path: sanitize(payload.path, 240),
    referrer: sanitize(payload.referrer, 300),
    language: sanitize(payload.language, 80),
    screen: sanitize(payload.screen, 40),
    browserTimezone: sanitize(payload.timezone, 80),
    colorScheme: sanitize(payload.colorScheme, 20),
    siteTime: sanitize(payload.siteTime, 80),
    linkType: sanitize(payload.linkType, 80),
    linkTarget: sanitize(payload.linkTarget, 300),
    durationSeconds: clampNumber(payload.durationSeconds, 0, 0, 86400),
    userAgent: sanitize(request.headers.get("User-Agent"), 300)
  };

  const client = parseUserAgent(record.userAgent);
  record.deviceType = client.deviceType;
  record.browser = client.browser;
  record.os = client.os;
  return record;
}

async function authorize(request, env) {
  const configuredToken = String(env.ADMIN_TOKEN || "");
  if (!configuredToken || configuredToken.length > MAX_TOKEN_LENGTH) {
    return { ok: false };
  }

  const url = new URL(request.url);
  const bearer = request.headers.get("Authorization") || "";
  const suppliedToken = bearer.startsWith("Bearer ")
    ? bearer.slice("Bearer ".length)
    : url.searchParams.get("token") || "";

  if (!suppliedToken || suppliedToken.length > MAX_TOKEN_LENGTH) {
    return { ok: false };
  }

  return { ok: constantTimeEqual(suppliedToken, configuredToken) };
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

async function readLimitedBody(request, maxBytes) {
  const reader = request.body?.getReader();
  if (!reader) {
    return "";
  }

  const chunks = [];
  let total = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    total += value.byteLength;
    if (total > maxBytes) {
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function corsHeaders(origin, env) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };

  if (isAllowedOrigin(origin, env)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function isAllowedOrigin(origin, env) {
  if (!origin) {
    return false;
  }
  return allowedOrigins(env).has(origin);
}

function isAllowedPixelSource(request, env) {
  const origin = request.headers.get("Origin") || "";
  if (origin && !isAllowedOrigin(origin, env)) {
    return false;
  }

  const referer = request.headers.get("Referer") || "";
  if (!referer) {
    return true;
  }

  try {
    return allowedOrigins(env).has(new URL(referer).origin);
  } catch (error) {
    return false;
  }
}

function allowedOrigins(env) {
  return new Set(
    String(env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  );
}

function retentionDays(env) {
  return clampNumber(env.LOG_RETENTION_DAYS, DEFAULT_RETENTION_DAYS, 1, 365);
}

function retentionSeconds(env) {
  return retentionDays(env) * 24 * 60 * 60;
}

function clampNumber(value, fallback, min, max) {
  const number = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, number));
}

function sanitize(value, maxLength) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value)
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, maxLength);
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function pixelHeaders() {
  return {
    "Content-Type": "image/gif",
    "Cache-Control": "no-store",
    "Content-Length": String(TRANSPARENT_GIF.byteLength)
  };
}

function renderAdminHtml(visitors, eventCount) {
  const rows = visitors.map((visitor) => `
    <tr>
      <td><code>${escapeHtml(visitor.ip)}</code></td>
      <td>${escapeHtml(formatLocation(visitor))}</td>
      <td>${escapeHtml(formatAsn(visitor))}</td>
      <td>${visitor.visitCount}</td>
      <td>${escapeHtml(formatBeijingTime(visitor.firstSeen))}</td>
      <td>${escapeHtml(formatBeijingTime(visitor.lastSeen))}</td>
      <td>${escapeHtml(formatDevice(visitor))}</td>
      <td>${escapeHtml(formatEngagement(visitor))}</td>
      <td>${escapeHtml(visitor.paths.join(", "))}</td>
      <td>${escapeHtml(visitor.referrers.join(", "))}</td>
    </tr>
  `).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Yanxia Wei Visit Log</title>
  <style>
    body { margin: 0; color: #20242a; background: #f7f8f5; font: 14px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { width: min(1180px, calc(100% - 32px)); margin: 32px auto; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    p { margin: 0 0 18px; color: #5d6570; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #d9ded8; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #e6e9e4; text-align: left; vertical-align: top; }
    th { color: #20242a; background: #eef2ec; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .empty { padding: 24px; background: #fff; border: 1px solid #d9ded8; }
  </style>
</head>
<body>
  <main>
    <h1>Yanxia Wei Visit Log</h1>
    <p>Loaded ${eventCount} recent event${eventCount === 1 ? "" : "s"} and grouped them by IP. Times are shown in Beijing time. IP geolocation is approximate.</p>
    ${visitors.length ? `<table>
      <thead>
        <tr>
          <th>IP</th>
          <th>Location</th>
          <th>Network</th>
          <th>Visits</th>
          <th>First seen</th>
          <th>Last seen</th>
          <th>Device</th>
          <th>Engagement</th>
          <th>Paths</th>
          <th>Referrers</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>` : `<div class="empty">No visits recorded yet.</div>`}
  </main>
</body>
</html>`;
}

function formatLocation(visitor) {
  return [visitor.city, visitor.region, visitor.country].filter(Boolean).join(", ") || "Unknown";
}

function formatAsn(visitor) {
  const parts = [];
  if (visitor.asOrganization) {
    parts.push(visitor.asOrganization);
  }
  if (visitor.asn) {
    parts.push(`AS${visitor.asn}`);
  }
  return parts.join(" / ") || "Unknown";
}

function formatDevice(visitor) {
  return [
    visitor.deviceType,
    visitor.browser,
    visitor.os,
    visitor.browserTimezone,
    visitor.colorScheme ? `${visitor.colorScheme} mode` : ""
  ].filter(Boolean).join(" / ") || "Unknown";
}

function formatEngagement(visitor) {
  const parts = [];
  if (visitor.durationEventCount > 0) {
    parts.push(`time: ${formatDuration(visitor.totalDurationSeconds)}`);
  }
  if (visitor.linkClicks.length > 0) {
    parts.push(`clicks: ${visitor.linkClicks.map((item) => `${item.type} ${item.count}`).join(", ")}`);
  }
  return parts.join(" | ") || "";
}

function formatDuration(seconds) {
  const total = Math.max(0, Number.parseInt(String(seconds || 0), 10));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  if (minutes > 0) {
    return `${minutes}m ${remainder}s`;
  }
  return `${remainder}s`;
}

function parseUserAgent(userAgent) {
  const ua = String(userAgent || "");
  const lower = ua.toLowerCase();

  let deviceType = "desktop";
  if (/ipad|tablet/.test(lower)) {
    deviceType = "tablet";
  } else if (/mobi|iphone|android/.test(lower)) {
    deviceType = "mobile";
  }

  let browser = "Unknown";
  if (/edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/opr\//i.test(ua) || /opera/i.test(ua)) {
    browser = "Opera";
  } else if (/chrome|crios/i.test(ua) && !/edg\//i.test(ua)) {
    browser = "Chrome";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox";
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = "Safari";
  }

  let os = "Unknown";
  if (/windows nt/i.test(ua)) {
    os = "Windows";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/mac os x|macintosh/i.test(ua)) {
    os = "macOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  return { deviceType, browser, os };
}

function formatBeijingTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date).replace(",", "") + " Beijing";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
