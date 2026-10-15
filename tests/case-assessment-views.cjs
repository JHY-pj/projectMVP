const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { loadUI } = require('./ui-loader.cjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function compile(file, requireFn, extra = '') {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText + extra, { exports, require: requireFn, Set, Number, Date });
  return exports;
}
const rules = compile('lib/case-assessment.ts', () => { throw Error('unexpected rule dependency'); });
function render(view, record, entries = {}) {
  let index = 0;
  const fakeReact = { ...React, useEffect() {}, useState(initial) { const i = index++; return [i === 0 ? entries : view === 'DemoReport' && i === 1 ? true : initial, () => {}]; } };
  const component = ({ children, href, id, className }) => React.createElement(href ? 'a' : 'div', { href, id, className }, children);
  const stubs = new Proxy({}, { get: () => component });
  const resolver = name => name === 'react' ? fakeReact : name === 'react/jsx-runtime' ? require(name) : name === '@/lib/case-assessment' ? rules : name === '@/components/member/case-ui' ? loadUI('components/member/case-ui.tsx') : name === '@/components/case-input-editor' ? editor : name === 'next/link' ? { default: component } : stubs;
  const editor = compile('components/case-input-editor.tsx', resolver);
  const views = compile('components/member-screens.tsx', resolver, '\nexports.views={DemoReport,PlanView};').views;
  return renderToStaticMarkup(React.createElement(views[view], { record, caseId: 'LOCAL-test' }));
}
const base = { case_id: 'LOCAL-test', claim_type: '대여금', claim_amount_band: '100만~300만 원', region: '모름', outcome_status: 'in_progress', process_status: '진행 중', enforcement_title_confirmed: 'Y', service_status: '정상', known_bank: 'Y', expected_cost_band: 'Unknown', priority_right_risk: 'N' };
const costReport = render('DemoReport', base);
assert(costReport.includes('대상 단서는 있으나 비용·권리 검토가 필요합니다'));
assert(costReport.includes('예금채권 검토'));
assert(costReport.includes('/app/cases/LOCAL-test/plan#plan-cost'));
assert(costReport.includes('판단에 사용할 정보 보완'));
const docReport = render('DemoReport', { ...base, enforcement_title_confirmed: 'Unknown' });
assert(docReport.includes('문서·송달 확인이 먼저 필요합니다'));
const costPlan = render('PlanView', base);
const docPlan = render('PlanView', { ...base, enforcement_title_confirmed: 'Unknown' });
assert(costPlan.indexOf('id="plan-cost"') < costPlan.indexOf('id="plan-judgment"'));
assert(docPlan.indexOf('id="plan-judgment"') < docPlan.indexOf('id="plan-cost"'));
const readyReport = render('DemoReport', base, { cost: [{ amount: 150000 }] });
assert(readyReport.includes('입력 기준의 기본 검토 정보가 모였습니다'));
assert(!readyReport.includes('비용 확인·기록'));
console.log('PASS view integration: changed inputs update report titles, candidates, action links and plan ordering; saved costs update report; input editor included.');
