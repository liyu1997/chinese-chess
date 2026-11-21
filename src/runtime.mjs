// Only public analytics configuration is exposed. Authentication stays in the existing service.
export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/analytics-config.js') {
   const token = typeof env.POSTHOG_PROJECT_TOKEN === 'string' ? env.POSTHOG_PROJECT_TOKEN.trim() : '';
   const host = typeof env.POSTHOG_HOST === 'string' ? env.POSTHOG_HOST.trim() : '';
   const enabled = env.POSTHOG_ENABLED === 'true' && /^phc_[A-Za-z0-9_-]+$/.test(token) &&
    ['https://us.i.posthog.com', 'https://eu.i.posthog.com'].includes(host);
   const config = { enabled, token: enabled ? token : '', host: enabled ? host : '', version: 'analytics-runtime-v1' };
   const body = 'window.MQAnalyticsConfig = ' + JSON.stringify(config) + ';\n';
   return new Response(request.method === 'HEAD' ? null : body, {headers: {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
   }});
  }
  return env.ASSETS.fetch(request);
 }
};
