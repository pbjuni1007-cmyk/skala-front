import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function runGameScript(file, prompts = [], random = 0.5) {
  const alerts = [];
  const listeners = new Map();
  let promptIndex = 0;
  const math = Object.create(Math);
  math.random = () => random;
  const sandbox = {
    console,
    document: {
      querySelector: () => ({
        addEventListener: (eventName, handler) => listeners.set(eventName, handler)
      })
    },
    Math: math,
    window: {
      alert: (message) => alerts.push(String(message)),
      prompt: () => prompts[promptIndex++] ?? null
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(root, 'script', file), 'utf8'), sandbox, { filename: file });
  listeners.get('click')?.();
  return alerts;
}

const upDown = runGameScript('upDown.js', ['abc', '30', '20', '25'], 0.48);
assert(upDown.some((message) => message.includes('정수를 입력')), 'Up-Down: 잘못된 입력 안내 누락');
assert(upDown.some((message) => message.startsWith('Down')), 'Up-Down: Down 분기 누락');
assert(upDown.some((message) => message.startsWith('Up')), 'Up-Down: Up 분기 누락');
assert(upDown.some((message) => message.includes('3번 만에')), 'Up-Down: 정답 또는 시도 횟수 오류');
assert(upDown.some((message) => message === '축하합니다! 3번 만에 맞추셨습니다.'), 'Up-Down: 교안 지정 성공 문구 불일치');

const upDownCancel = runGameScript('upDown.js', [null], 0.48);
assert(upDownCancel.some((message) => message.includes('종료')), 'Up-Down: 취소 분기 누락');

const grade = runGameScript('grade.js', ['110', '90', '80', '70']);
assert(grade.some((message) => message.includes('0부터 100')), '성적 계산기: 범위 검사 누락');
assert(grade.some((message) => message.includes('총점: 240점')), '성적 계산기: 총점 계산 오류');
assert(grade.some((message) => message.includes('평균: 80.0점')), '성적 계산기: 평균 계산 오류');
assert(grade.some((message) => message.includes('판정: 합격')), '성적 계산기: 판정 오류');

const gradeFail = runGameScript('grade.js', ['10', '20', '30']);
assert(gradeFail.some((message) => message.includes('판정: 불합격')), '성적 계산기: 60점 미만 불합격 분기 누락');

const gradeCancel = runGameScript('grade.js', [null]);
assert(gradeCancel.some((message) => message.includes('취소')), '성적 계산기: 취소 분기 누락');

const bag = runGameScript('bag.js');
assert(bag.some((message) => message.includes('맥북: 1개')), '가방 보기: Object/Array 출력 누락');
assert(bag.some((message) => message.includes('이어폰: 2개')), '가방 보기: 물품 수량 출력 누락');
assert(bag.some((message) => message.includes('총 4종류')), '가방 보기: 종류 수 오류');

if (failures.length > 0) {
  for (const failure of failures) console.error(`ERROR ${failure}`);
  process.exitCode = 1;
} else {
  console.log('미니 실습 테스트: PASS (Up-Down, 성적 계산기, 가방 보기)');
}
