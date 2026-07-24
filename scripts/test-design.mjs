import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'css/style.css'), 'utf8');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function variablesFrom(blockPattern) {
  const block = css.match(blockPattern)?.[1] ?? '';
  return new Map([...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g)?.map((value) => Number.parseInt(value, 16) / 255) ?? [];
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(first, second) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

const day = variablesFrom(/:root\s*{([^]*?)\n}/);
const night = new Map(day);
for (const [name, value] of variablesFrom(/html\[data-theme="night"\]\s*{([^]*?)\n}/)) night.set(name, value);

assert(day.get('seoul-coral')?.toLowerCase() === '#f8496c', '디자인: Seoulmate primary coral token 누락');
assert(/(?:Design|reference)\s+source:\s*pbjuni1007-cmyk\/seoulmate-pbjuni1007/i.test(css), '디자인: CSS provenance 주석 누락');
assert(readme.includes('b965d46bbff3ff9fec77bf67e5b812f7877445a9'), '디자인: README source commit 누락');
assert(/\.info-card:hover[^]*?translateY\(-4px\)/.test(css), '디자인: card hover elevation 누락');
assert(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css), '디자인: reduced motion 대응 누락');
assert(/\.trip-figure img\s*{[^}]*aspect-ratio:\s*1;[^}]*object-fit:\s*contain;/s.test(css), '디자인: 여행 사진 전체 표시 프레임 누락');
assert(/\.media-grid\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);[^}]*align-items:\s*start;/s.test(css), '디자인: 세로 영상용 미디어 단일 열 배치 누락');
assert(/\.media-grid \.video-card\s*{[^}]*width:\s*min\(100%,\s*480px\);[^}]*justify-self:\s*center;/s.test(css), '디자인: 세로 영상 Reel 카드 정렬 누락');

for (const [themeName, variables] of [['낮', day], ['밤', night]]) {
  const buttonContrast = contrast(variables.get('button-bg'), variables.get('button-text'));
  const linkContrast = contrast(variables.get('accent-dark'), variables.get('surface'));
  assert(buttonContrast >= 4.5, `디자인: ${themeName} 테마 버튼 대비 부족 (${buttonContrast.toFixed(2)}:1)`);
  assert(linkContrast >= 4.5, `디자인: ${themeName} 테마 링크 대비 부족 (${linkContrast.toFixed(2)}:1)`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`ERROR ${failure}`);
  process.exitCode = 1;
} else {
  console.log('디자인 테스트: PASS (Seoulmate provenance, token, hover, reduced motion, WCAG contrast)');
}
