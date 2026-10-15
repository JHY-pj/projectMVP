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
