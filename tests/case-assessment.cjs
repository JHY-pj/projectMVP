const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/case-assessment.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports: mod.exports, Set, Number });
const { assessCase } = mod.exports;
let count = 0;
function check(name, fn) { fn(); count++; console.log(`PASS ${name}`); }
const base = { outcome_status: 'in_progress', enforcement_title_confirmed: 'Y', service_status: '정상', known_bank: 'Y', expected_cost_band: 'under-10', priority_right_risk: 'N' };
check('unknown inputs never become ready or invent a target', () => { const a = assessCase({}); assert.equal(a.status, 'documents'); assert.equal(a.candidates.length, 0); assert.equal(a.planOrder[0], 'judgment'); });
check('fully populated inputs permit information review without success scores', () => { const a = assessCase(base); assert.equal(a.status, 'ready'); assert.equal(a.checks.length, 0); assert.equal(a.candidates[0], '예금채권 검토'); assert.equal(a.score, undefined); });
check('bank and employer clues change candidates', () => { const a = assessCase({ ...base, known_bank: 'N', known_employer: 'Y' }); assert.equal(a.candidates.length, 1); assert.equal(a.candidates[0], '급여채권 검토'); });
check('documents precede positive target/cost clues', () => { const a = assessCase({ ...base, enforcement_title_confirmed: 'Unknown' }); assert.equal(a.status, 'documents'); assert.equal(a.checks[0].id, 'judgment'); });
check('unknown service keeps document check', () => assert.equal(assessCase({ ...base, service_status: 'Unknown' }).status, 'documents'));
check('general asset clue does not invent concrete target', () => { const a = assessCase({ ...base, known_bank: 'Unknown', asset_signal: '있음' }); assert.equal(a.status, 'target'); assert.equal(a.candidates.length, 0); assert.equal(a.planOrder[0], 'target'); });
check('no clue is not a finding of no assets', () => { const a = assessCase({ ...base, known_bank: 'N', known_employer: 'N', known_vehicle: 'N', known_real_estate: 'N' }); assert(a.checks[0].reason.includes('확정이 아닙니다')); });
check('cost missing and priority risk produce distinct checks', () => { const a = assessCase({ ...base, expected_cost_band: 'Unknown', priority_right_risk: 'Y' }); assert.equal(a.status, 'review'); assert(a.checks.some(x => x.id === 'cost')); assert(a.checks.some(x => x.title.includes('영향'))); });
check('invalid cost values are not accepted', () => assert.equal(assessCase({ ...base, expected_cost_band: 'bogus' }).status, 'review'));
check('latest priority correction overrides an older clear entry', () => { const a = assessCase(base, { priority: [{ details: { subject: '예금채권', priorityResult: '없음' } }, { details: { subject: '예금채권', priorityResult: '있음' } }] }); assert.equal(a.status, 'review'); });
check('unrelated priority record cannot clear the current target', () => assert.equal(assessCase(base, { priority: [{ details: { subject: '부동산', priorityResult: '없음' } }] }).status, 'review'));
check('saving a cost entry resolves cost check; deleting restores it', () => { const input = { ...base, expected_cost_band: 'Unknown' }; assert.equal(assessCase(input, { cost: [{ amount: 120000 }] }).status, 'ready'); assert.equal(assessCase(input, {}).status, 'review'); });
check('new pending document record overrides old confirmed input', () => assert.equal(assessCase(base, { judgment: [{ details: { finality: '확정' } }, { details: { finality: '확인 중' } }] }).status, 'documents'));
check('excluded/paused target prevents ready', () => assert.equal(assessCase(base, { target: [{ details: { method: '예금채권 압류·추심', decision: '제외' } }] }).status, 'target'));
check('full recovery stops new enforcement checks', () => { const a = assessCase({ ...base, outcome_status: 'success_full' }); assert.equal(a.status, 'closed'); assert.equal(a.checks.length, 0); });
check('abandonment is respected and partial recovery remains distinct', () => { assert.equal(assessCase({ ...base, outcome_status: 'abandoned' }).status, 'paused'); assert(assessCase({ ...base, outcome_status: 'success_partial' }).reasons[0].includes('남은 채권')); });
check('region/elapsed time do not become arbitrary success multipliers', () => assert.equal(assessCase({ ...base, region: '모름', judgment_elapsed_band: '5년 이상' }).status, 'ready'));
check('same inputs yield deterministic results without mutation', () => { const before = JSON.stringify(base); assert.equal(JSON.stringify(assessCase(base)), JSON.stringify(assessCase(base))); assert.equal(JSON.stringify(base), before); });
check('editing an earlier record uses its save time rather than array position', () => {
  const a = assessCase(base, { priority: [{ savedAt: 200, details: { subject: '예금채권', priorityResult: '있음' } }, { savedAt: 100, details: { subject: '예금채권', priorityResult: '없음' } }] });
  assert.equal(a.status, 'review');
});

console.log(`${count} rule scenarios passed.`);
