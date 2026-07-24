import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'script/theme.js'), 'utf8');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function runThemeScript({ initialTheme = null, storageThrows = false } = {}) {
  const dataset = {};
  const attributes = new Map();
  const listeners = new Map();
  const stored = new Map();
  const warnings = [];
  if (initialTheme) stored.set('skala-theme', initialTheme);

  const label = { textContent: '' };
  const toggle = {
    addEventListener: (eventName, handler) => listeners.set(eventName, handler),
    querySelector: (selector) => selector === '.theme-label' ? label : null,
    setAttribute: (name, value) => attributes.set(name, value)
  };
  const localStorage = {
    getItem: (key) => {
      if (storageThrows) throw new Error('storage blocked');
      return stored.get(key) ?? null;
    },
    setItem: (key, value) => {
      if (storageThrows) throw new Error('storage blocked');
      stored.set(key, value);
    }
  };
  const sandbox = {
    console: { warn: (...args) => warnings.push(args.join(' ')) },
    document: {
      documentElement: { dataset },
      querySelector: (selector) => selector === '#theme-toggle' ? toggle : null
    },
    window: { localStorage }
  };

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'theme.js' });
  return { attributes, dataset, label, listeners, stored, warnings };
}

const savedNight = runThemeScript({ initialTheme: 'night' });
assert(savedNight.dataset.theme === 'night', '테마: 저장된 밤 테마를 적용하지 못함');
assert(savedNight.attributes.get('aria-pressed') === 'true', '테마: 밤 상태 aria-pressed 오류');
assert(savedNight.label.textContent === '낮 테마', '테마: 다음 동작 label 오류');

savedNight.listeners.get('click')?.();
assert(savedNight.dataset.theme === 'day', '테마: 클릭 후 낮 테마 전환 실패');
assert(savedNight.stored.get('skala-theme') === 'day', '테마: 변경 상태 localStorage 저장 실패');
assert(savedNight.attributes.get('aria-pressed') === 'false', '테마: 낮 상태 aria-pressed 오류');

const blockedStorage = runThemeScript({ storageThrows: true });
assert(blockedStorage.dataset.theme === 'day', '테마: 저장소 차단 시 기본 테마 적용 실패');
blockedStorage.listeners.get('click')?.();
assert(blockedStorage.dataset.theme === 'night', '테마: 저장소 차단 시 UI 전환 실패');
assert(blockedStorage.warnings.length === 2, '테마: 저장소 오류 기록 누락');

if (failures.length > 0) {
  for (const failure of failures) console.error(`ERROR ${failure}`);
  process.exitCode = 1;
} else {
  console.log('테마 테스트: PASS (저장 복원, 전환, 접근성 상태, 저장소 오류)');
}
