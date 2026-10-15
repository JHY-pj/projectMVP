const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const postcss = require('postcss');
const styles = new Proxy({}, { get: (_, key) => String(key) });
function load(file) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText, { exports, require: name => name.endsWith('.module.css') ? { default: styles } : name === '@/lib/utils' ? { cn: require('clsx').clsx } : require(name) });
  return exports;
}
const { Button } = load('components/ui/button.tsx');
const { Badge } = load('components/ui/badge.tsx');
const button = renderToStaticMarkup(React.createElement(Button, { size: 'sm', type: 'submit', disabled: true, 'aria-label': '저장' }, '저장'));
assert(button.includes('type="submit"')); assert(button.includes('disabled=""')); assert(button.includes('aria-label="저장"'));
const link = renderToStaticMarkup(React.createElement(Button, { size: 'sm', variant: 'outline', asChild: true }, React.createElement('a', { href: '/app/cases', 'aria-label': '목록' }, '목록')));
assert(link.startsWith('<a ')); assert(!link.includes('<button')); assert(link.includes('href="/app/cases"')); assert(link.includes('data-slot="button"'));
for (const size of ['xs', 'sm', 'default', 'lg']) {
  const action = renderToStaticMarkup(React.createElement(Button, { size }, '수정'));
  const badge = renderToStaticMarkup(React.createElement(Badge, { size }, '진행 중'));
  const expected = size === 'default' ? 'md' : size;
  assert(action.includes('control button')); assert(badge.includes('control badge'));
  assert(action.includes(expected)); assert(badge.includes(expected));
}
const layout = /^(?:position|top|right|bottom|left|inset(?:-.+)?|width|min-width|max-width|margin(?:-.+)?|grid-.+|flex(?:-.+)?|align-self|justify-self|order)$/;
postcss.parse(fs.readFileSync('app/globals.css', 'utf8')).walkRules(rule => {
  if (/\[data-slot="(?:button|badge)"\]/.test(rule.selector)) rule.walkDecls(d => assert(layout.test(d.prop), `Global appearance override: ${rule.selector} ${d.prop}`));
});
let total = 0;
function walkDir(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) { if (file !== 'components/ui') walkDir(file); continue; } if (!file.endsWith('.tsx')) continue;
 const sf = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
 function visit(node) { if (ts.isJsxElement(node)) { const tag = node.openingElement.tagName.getText(sf); assert.notEqual(tag, 'button', `Native action remains in ${file}`);
 if (tag === 'Button') { total++; const asChild = node.openingElement.attributes.properties.some(a => ts.isJsxAttribute(a) && a.name.getText(sf) === 'asChild');
 if (asChild) { const children = node.children.filter(c => !ts.isJsxText(c) || c.text.trim()); assert.equal(children.length, 1, `Slot must have one child in ${file}`); assert(ts.isJsxElement(children[0])); assert(['Link','a'].includes(children[0].openingElement.tagName.getText(sf))); }
 }
 } ts.forEachChild(node, visit); } visit(sf);
} }
walkDir('components');
console.log(`PASS ${total} component actions audited; single-child links, submit/disabled/ARIA preservation, shared badge/button sizes, no page appearance overrides.`);
