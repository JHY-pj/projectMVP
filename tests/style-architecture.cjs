const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const postcss = require('postcss');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const layout = /^(?:position|top|right|bottom|left|inset(?:-.+)?|width|min-width|max-width|max-height|margin(?:-.+)?|grid-.+|flex(?:-.+)?|align-self|justify-self|order|gap)$/;
function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
for (const f of files('components').filter(f => f.endsWith('.css') && !f.endsWith('.module.css'))) {
  postcss.parse(fs.readFileSync(f, 'utf8')).walkRules(rule => {
    if (/\[data-ui=|\[data-slot="(?:button|badge|tabs-|dialog-|progress)/.test(rule.selector)) rule.walkDecls(d => assert(layout.test(d.prop), `Page overrides shared appearance: ${f}: ${rule.selector} ${d.prop}`));
  });
}
postcss.parse(fs.readFileSync('app/globals.css', 'utf8')).walkRules(rule => assert(!/\.(?:case-|wizard-|plan-|auth-|chat-|hero-|panel\b|field\b)/.test(rule.selector), `Screen CSS in globals: ${rule.selector}`));
const exportsObject = {};
const styles = new Proxy({}, { get: (_, key) => String(key) });
vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/common/primitives.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText, { exports: exportsObject, require: n => n.endsWith('.module.css') ? { default: styles } : n === '@/lib/utils' ? { cn: require('clsx').clsx } : require(n) });
const { Surface, Input, Select, Textarea, Field, PageLayout } = exportsObject;
const form = renderToStaticMarkup(React.createElement(Surface, { as: 'form', stack: true, onSubmit() {} }, React.createElement(Field, { htmlFor: 'memo' }, '메모'), React.createElement(Textarea, { id: 'memo', name: 'memo', defaultValue: '저장 내용' })));
assert(form.startsWith('<form ')); assert(form.includes('for="memo"')); assert(form.includes('name="memo"')); assert(form.includes('저장 내용'));
const input = renderToStaticMarkup(React.createElement(Input, { type: 'checkbox', name: 'consent', defaultChecked: true, required: true }));
assert(input.includes('type="checkbox"')); assert(input.includes('checked=""')); assert(input.includes('required=""')); assert(input.includes('checkInput'));
const select = renderToStaticMarkup(React.createElement(Select, { name: 'kind', defaultValue: 'b' }, React.createElement('option', { value: 'a' }, 'A'), React.createElement('option', { value: 'b' }, 'B')));
assert(select.includes('selected=""')); assert(select.includes('name="kind"'));
const page = renderToStaticMarkup(React.createElement(PageLayout, { width: 'reading', id: 'main-content' }, '내용'));
assert(page.startsWith('<main ')); assert(page.includes('reading')); assert(page.includes('id="main-content"'));
console.log('PASS style ownership and shared form/page semantics: no screen CSS in globals, no page appearance overrides, native form/field/input behavior preserved.');

// Screen composition may import components, never another route's stylesheet.
for (const f of files('components').filter(f => f.endsWith('.tsx'))) {
  const text = fs.readFileSync(f, 'utf8');
  assert(!/import ["'][^"']+(?<!\.module)\.css["']/.test(text), `Unscoped component stylesheet: ${f}`);
}
const domains = {
  'member/case-ui': ['member-screens.tsx', 'case-input-editor.tsx', 'member/case-list-card.tsx'],
  'public/public-ui': ['public-screens.tsx', 'public/home-sections.tsx'],
  'auth/auth-ui': ['auth-screens.tsx', 'auth/signup-consent.tsx'],
  'admin/admin-ui': ['admin-screens.tsx'],
  'shell/shell-ui': ['site-shell.tsx'],
  'support/chat-ui': ['support-chat-screen.tsx'],
  'legal/legal-ui': ['legal/legal-content.tsx', 'legal/legal-document-dialog.tsx'],
};
for (const [owner, sources] of Object.entries(domains)) {
  const css = fs.readFileSync(`components/${owner}.module.css`, 'utf8');
  const declared = new Set([...css.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(m => m[1]));
  const source = fs.readFileSync(`components/${owner}.tsx`, 'utf8');
  assert(source.includes('.module.css'), `Missing component stylesheet: ${owner}`);
  for (const match of source.matchAll(/styles\["([\w-]+)"\]/g)) assert(declared.has(match[1]), `Undefined part style: ${owner}: ${match[1]}`);
  for (const file of sources) assert(fs.readFileSync(`components/${file}`, 'utf8').includes(`@/components/${owner}`) || fs.readFileSync(`components/${file}`, 'utf8').includes(`./${owner.split('/').pop()}`), `Missing component import: ${file}`);
  for (const file of sources) {
    const text = fs.readFileSync(`components/${file}`, 'utf8');
    const tree = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isCallExpression(node) && node.expression.getText(tree) === 'uiClass') {
        for (const argument of node.arguments) if (ts.isStringLiteral(argument)) for (const name of argument.text.split(/\s+/)) {
          assert(declared.has(name) || ['eyebrow', 'eyebrow-dot', 'motion-enter', 'compass-needle', 'content-width', 'sr-only'].includes(name), `Unstyled class at use site: ${file}: ${name}`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }

}
const { loadUI } = require('./ui-loader.cjs');
const parts = loadUI('components/member/case-ui.tsx');
const item = renderToStaticMarkup(React.createElement(parts.CaseListItem, { id: 'case-one' }, '사건'));
const submitHandler = () => {};
assert.equal(parts.ResultForm({ onSubmit: submitHandler }).props.onSubmit, submitHandler);
assert(item.startsWith('<article ')); assert(item.includes('scoped_case-list-item')); assert(item.includes('id="case-one"'));
const row = loadUI('components/common/primitives.tsx').InputAction({ children: '입력과 버튼', 'aria-label': '등록' });
assert.equal(row.type, 'div'); assert.equal(row.props['aria-label'], '등록');
const { SelectionCard } = loadUI('components/common/selection-card.tsx');
const choice = renderToStaticMarkup(React.createElement(SelectionCard, { selected: true, htmlFor: 'target' }, '선택'));
assert(choice.startsWith('<label ')); assert(choice.includes('data-selected="true"')); assert(choice.includes('for="target"'));
const shell = loadUI('components/shell/shell-ui.tsx');
const nav = renderToStaticMarkup(React.createElement(shell.NavigationLink, { href: '/app', active: true }, '홈'));
assert(nav.startsWith('<a ')); assert(nav.includes('aria-current="page"')); assert(nav.includes('scoped_is-active'));
const { ChatMessage } = loadUI('components/support/chat-ui.tsx');
const message = renderToStaticMarkup(React.createElement(ChatMessage, { role: 'user' }, '질문'));
assert(message.startsWith('<article ')); assert(message.includes('scoped_chat-message-user')); assert(!message.includes('role="user"'));
assert(fs.readFileSync('components/site-shell.tsx', 'utf8').includes('<MobileBottomNav />'), 'Mobile navigation must render its links');
assert(fs.readFileSync('components/site-shell.tsx', 'utf8').includes('[data-mobile-menu]'), 'Menu close behaviour must use stable data selectors');
assert(fs.readFileSync('components/public-screens.tsx', 'utf8').includes('<EligibilityBar />'));
console.log('PASS component CSS ownership, native semantics, navigation, selection and message states.');

// Non-circular UI corners share role-based tokens across desktop and mobile.
for (const f of files('components').filter(f => f.endsWith('.css'))) {
  postcss.parse(fs.readFileSync(f, 'utf8')).walkDecls('border-radius', d => {
    assert(/^(?:0|inherit|var\(--ui-radius-(?:small|control|panel)\))$/.test(d.value) || /^(?:[\d.]+%\s*)+$/.test(d.value), `Unmanaged radius: ${f}: ${d.parent.selector}: ${d.value}`);
  });
}
console.log('PASS shared radius tokens; circular and decorative shapes preserved.');

for (const f of files('components').filter(f => f.endsWith('.css'))) {
  postcss.parse(fs.readFileSync(f, 'utf8')).walkRules(rule => assert(rule.selector.trim(), `Empty selector: ${f}`));
}
for (const owner of Object.keys(domains)) {
  postcss.parse(fs.readFileSync(`components/${owner}.module.css`, 'utf8')).walkRules(rule => {
    if (/\[data-ui=|\[data-slot="(?:button|badge|tabs-|dialog-|progress)/.test(rule.selector)) rule.walkDecls(d => assert(layout.test(d.prop), `Feature overrides shared appearance: ${owner}: ${rule.selector} ${d.prop}`));
  });
}
console.log('PASS feature styles cannot override shared controls and panels.');

// Baseline rules must precede breakpoint adjustments, so mobile geometry is not reset later.
for (const owner of ['public/public-ui', 'admin/admin-ui', 'auth/auth-ui', 'support/chat-ui', 'shell/shell-ui']) {
  const root = postcss.parse(fs.readFileSync(`components/${owner}.module.css`, 'utf8'));
  let hasMedia = false;
  for (const node of root.nodes) {
    if (node.type === 'atrule' && node.name === 'media') hasMedia = true;
    if (node.type === 'rule') assert(!hasMedia, `Baseline after breakpoint: ${owner}: ${node.selector}`);
  }
}
console.log('PASS responsive baseline and breakpoint ordering.');

// Check the actual declaration cascade at representative viewport widths.
function declarationsAt(file, selector, width) {
  const result = {};
  const root = postcss.parse(fs.readFileSync(file, 'utf8'));
  root.walkRules(rule => {
    if (!rule.selectors.includes(selector)) return;
    for (let node = rule.parent; node && node.type !== 'root'; node = node.parent) {
      if (node.type !== 'atrule' || node.name !== 'media') continue;
      for (const match of node.params.matchAll(/(min|max)-width:\s*([\d.]+)(rem|px)/g)) {
        const boundary = Number(match[2]) * (match[3] === 'rem' ? 16 : 1);
        if (match[1] === 'min' ? width < boundary : width > boundary) return;
      }
    }
    rule.walkDecls(d => { result[d.prop] = d.value; });
  });
  return result;
}
for (const width of [375, 768, 1280]) {
  const shellFile = 'components/shell/shell-ui.module.css';
  assert.equal(declarationsAt(shellFile, '.mobile-menu', width).display, width <= 1024 ? 'block' : 'none');
  assert.equal(declarationsAt(shellFile, '.desktop-nav', width).display, width <= 1024 ? 'none' : 'flex');
  assert.equal(declarationsAt(shellFile, '.header-inner', width)['min-height'], width <= 1024 ? '4.125rem' : '4.75rem');
  const chat = declarationsAt('components/support/chat-ui.module.css', '.support-chat-messages', width);
  assert.equal(chat['max-height'], width <= 760 ? '24rem' : width <= 1024 ? '30rem' : '34rem');
}
assert.equal(declarationsAt('components/common/primitives.module.css', '.inputAction > :global([data-slot="button"])', 375).height, 'auto');
assert.equal(declarationsAt('components/shell/shell-ui.module.css', '.nav-link', 1280)['border-radius'], 'var(--ui-radius-control)');
console.log('PASS responsive declaration cascade at 375/768/1280px and input/button alignment.');

const tabCss = 'components/ui/tabs.module.css';
assert.equal(declarationsAt(tabCss, '.responsive', 375).display, 'flex');
assert.equal(declarationsAt(tabCss, '.responsive', 375)['flex-wrap'], 'nowrap');
assert.equal(declarationsAt(tabCss, '.responsive', 375)['overflow-x'], 'auto');
assert.equal(declarationsAt(tabCss, '.responsive', 375)['overflow-y'], 'hidden');
assert.equal(declarationsAt(tabCss, '.trigger', 375)['white-space'], 'nowrap');
assert.equal(declarationsAt(tabCss, '.responsive', 1280).display, 'grid');
console.log('PASS mobile tabs stay on one horizontal scrolling row without vertical overflow.');
