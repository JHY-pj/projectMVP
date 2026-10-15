const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const cache = new Map();
function loadUI(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const resolver = name => {
    if (name.endsWith('.module.css')) {
      const path = require('node:path');
      const cssFile = name.startsWith('@/') ? name.slice(2) : path.join(path.dirname(file), name);
      const css = fs.readFileSync(cssFile, 'utf8');
      const classes = Object.fromEntries([...css.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(m => [m[1], `scoped_${m[1]}`]));
      return { default: classes };
    }
    if (name === '@/lib/utils') return { cn: require('clsx').clsx };
    if (name === 'next/link') return { default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (name.startsWith('@/')) {
      const base = name.slice(2);
      const target = [base + '.tsx', base + '.ts'].find(fs.existsSync);
      if (target) return loadUI(target);
    }
    return require(name);
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText, { exports, require: resolver });
  return exports;
}
module.exports = { loadUI };
