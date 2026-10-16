// Real HTTP integration: class names in HTML must have rules in delivered CSS.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const net = require('node:net');
const paths = ['/', '/about', '/guide', '/faq', '/notices', '/terms', '/privacy', '/disclaimer', '/data-policy', '/support', '/app', '/app/cases', '/app/cases/new', ...['summary', 'report', 'plan', 'status', 'result', 'data'].map(section => `/app/cases/demo-2026/${section}`)];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function main() {
  let child;
  let log = '';
  let base = process.env.STYLE_TEST_URL;
  const failures = [];
  try {
    if (!base) {
      const probe = net.createServer();
      await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
      const port = probe.address().port;
      await new Promise(resolve => probe.close(resolve));
      base = `http://127.0.0.1:${port}`;
      child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
      for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { log = (log + chunk).slice(-6000); });
      let ready = false;
      for (let attempt = 0; attempt < 90; attempt++) {
        if (child.exitCode !== null) throw new Error(`Dev server exited: ${log}`);
        try { const response = await fetch(base, { signal: AbortSignal.timeout(1000) }); if (response.ok) { await response.text(); ready = true; break; } } catch {}
        await delay(300);
      }
      assert(ready, `Dev server not ready: ${log}`);
    }
    const cache = new Map();
    for (const pathname of paths) {
      const response = await fetch(base + pathname, { signal: AbortSignal.timeout(15000) });
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      const links = [...html.matchAll(/<link\b[^>]*>/g)].map(match => match[0]).filter(tag => /rel="stylesheet"/.test(tag)).map(tag => tag.match(/href="([^"]+)"/)[1]);
      let css = '';
      for (const href of links) {
        if (!cache.has(href)) {
          const sheet = await fetch(new URL(href.replaceAll('&amp;', '&'), base), { headers: { Accept: 'text/css' }, signal: AbortSignal.timeout(15000) });
          assert.equal(sheet.status, 200, href);
          assert(sheet.headers.get('content-type')?.includes('text/css'), `Not a stylesheet: ${href}`);
          cache.set(href, await sheet.text());
        }
        css += cache.get(href);
      }
      const classes = new Set([...html.matchAll(/class="([^"]*)"/g)].flatMap(match => match[1].split(/\s+/)).filter(name => /^_[\w-]+_[a-z\d]+_\d+$/i.test(name)));
      assert(classes.size > 0, `No rendered component classes: ${pathname}`);
      const missing = [...classes].filter(name => !css.includes('.' + name));
      if (pathname.startsWith('/app/cases/demo-2026/')) {
        for (const selector of ['case-identity', 'report-check-list', 'plan-heading', 'delete-request-notice', 'inputAction']) {
          if (!css.includes('_' + selector + '_')) missing.push(`deferred detail style: ${selector}`);
        }
      }
      if (missing.length) failures.push(`${pathname}: ${missing.join(', ')}`);
      console.log(`${missing.length ? 'FAIL' : 'PASS'} ${pathname}: ${classes.size} scoped classes, ${links.length} stylesheets`);
    }
    assert.equal(failures.length, 0, `CSS delivery omissions:\n${failures.join('\n')}`);
  } finally {
    if (child) { try { process.kill(-child.pid, 'SIGTERM'); } catch {} }
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
