import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const errors = [];
const warnings = [];

const requiredFiles = [
  'package.json',
  'README.md',
  'html/index.html',
  'html/myHoliday.html',
  'html/myProfile.html',
  'html/myClass.html',
  'html/myTrip.html',
  'html/signUp.html',
  'html/signUpResult.html',
  'css/style.css',
  'script/upDown.js',
  'script/grade.js',
  'script/bag.js',
  'script/theme.js',
  'script/realtimeInfo.js',
  'script/weatherAPI.js',
  'script/signupRules.js',
  'script/signupValidation.js',
  'script/signupResult.js',
  'media/travel-ambient.mp3',
  'media/video_1_720p.mp4',
  'scripts/test-design.mjs',
  'scripts/test-signup.mjs'
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) errors.push(`필수 파일 없음: ${file}`);
}

const htmlFiles = readdirSync(join(root, 'html'))
  .filter((name) => extname(name) === '.html')
  .map((name) => join(root, 'html', name));

const voidElements = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function validateTagBalance(file, source) {
  const stack = [];
  const withoutComments = source.replace(/<!--[^]*?-->/g, '');
  for (const match of withoutComments.matchAll(/<(\/)?([a-z][\w-]*)\b[^>]*>/gi)) {
    const closing = Boolean(match[1]);
    const tag = match[2].toLowerCase();
    if (voidElements.has(tag)) continue;
    if (!closing) {
      stack.push(tag);
      continue;
    }
    const expected = stack.pop();
    if (expected !== tag) {
      errors.push(`HTML 태그 중첩 오류: ${file}에서 </${tag}> 앞에 <${expected ?? '없음'}>`);
      return;
    }
  }
  if (stack.length > 0) errors.push(`닫히지 않은 HTML 태그: ${file} -> ${stack.join(', ')}`);
}

for (const file of htmlFiles) {
  const source = readFileSync(file, 'utf8');
  if (!/^<!DOCTYPE html>/i.test(source.trimStart())) errors.push(`DOCTYPE 없음: ${file}`);
  if (!/<html\s+lang="ko"/i.test(source)) errors.push(`lang="ko" 없음: ${file}`);
  if (!/<meta\s+name="viewport"/i.test(source)) errors.push(`viewport 없음: ${file}`);
  if (!/사용 element\s*:/.test(source)) errors.push(`헤더 실습 설명 누락: ${file}`);
  if (!/CSS는 이 HTML 파일 내에서 적용하지 않고,\s*외부 style\.css 파일에서\s*적용됩니다\./.test(source)) {
    errors.push(`외부 CSS 설명 누락: ${file}`);
  }
  validateTagBalance(file, source);

  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|#|data:)/.test(target)) continue;
    const withoutQuery = target.split(/[?#]/)[0];
    if (!withoutQuery) continue;
    const resolved = resolve(dirname(file), withoutQuery);
    if (!existsSync(resolved)) errors.push(`깨진 로컬 링크: ${file} -> ${target}`);
  }
}

const index = readFileSync(join(root, 'html/index.html'), 'utf8');
const classSchedule = readFileSync(join(root, 'html/myClass.html'), 'utf8');
const trip = readFileSync(join(root, 'html/myTrip.html'), 'utf8');
const signup = readFileSync(join(root, 'html/signUp.html'), 'utf8');
const signupValidation = readFileSync(join(root, 'script/signupValidation.js'), 'utf8');
const signupRules = readFileSync(join(root, 'script/signupRules.js'), 'utf8');
const css = readFileSync(join(root, 'css/style.css'), 'utf8');
const realtime = readFileSync(join(root, 'script/realtimeInfo.js'), 'utf8');
const weatherApi = readFileSync(join(root, 'script/weatherAPI.js'), 'utf8');
const theme = readFileSync(join(root, 'script/theme.js'), 'utf8');
const upDown = readFileSync(join(root, 'script/upDown.js'), 'utf8');
const grade = readFileSync(join(root, 'script/grade.js'), 'utf8');
const mediaReadme = readFileSync(join(root, 'media/README.md'), 'utf8');

const checks = [
  [/<title>Welcome SKALA<\/title>/, index, 'index: required title'],
  [/<h1>\s*환영 인사\s*<\/h1>/, index, 'index: required welcome h1'],
  [/<p class="welcome-copy">\s*스칼라에 오신 것을 환영합니다\.\s*<\/p>/, index, 'index: required welcome paragraph'],
  [/<header[\s>]/, index, 'index: header'],
  [/<nav[\s>]/, index, 'index: nav'],
  [/<main[\s>]/, index, 'index: main'],
  [/<aside[\s>]/, index, 'index: aside'],
  [/<footer[\s>]/, index, 'index: footer'],
  [/class="class-schedule"/, classSchedule, 'class: schedule table'],
  [/월 7\/20/, classSchedule, 'class: Monday date'],
  [/회귀 모형 구축·예측·평가 종합실습/, classSchedule, 'class: data analysis finale'],
  [/가중치 Heatmap\s*시각화/, classSchedule, 'class: Tuesday attention practice'],
  [/GPT-2 문장 생성·다음 토큰 분석 종합실습/, classSchedule, 'class: Wednesday GPT-2 practice'],
  [/HTML Form/, classSchedule, 'class: Thursday HTML Form'],
  [/HTML·CSS 개인 Portal 종합실습/, classSchedule, 'class: Thursday final practice'],
  [/DOM·Fetch 날씨 기능 종합실습/, classSchedule, 'class: Friday async practice'],
  [/Async·Fetch·ES Module\s*적용/, classSchedule, 'class: Friday ES Module practice'],
  [/<td rowspan="2" class="merged-class">/, classSchedule, 'class: consecutive class rowspan'],
  [/<td colspan="5">점심 휴식<\/td>/, classSchedule, 'class: shared lunch'],
  [/<audio\s+controls/, trip, 'trip: audio'],
  [/<video\s+controls/, trip, 'trip: video'],
  [/<div class="trip-map-card">/, trip, 'trip: embedded map card'],
  [/<p class="trip-card">/, trip, 'trip: required paragraph card'],
  [/src="\.\.\/media\/video_1_720p\.mp4"\s+type="video\/mp4"/, trip, 'trip: MP4 source and MIME'],
  [/<form[^>]+action="signUpResult\.html"[^>]+method="get"/i, signup, 'signup: GET form'],
  [/required/, signup, 'signup: required validation'],
  [/id="signup-form"/, signup, 'signup: validation form target'],
  [/id="userPwConfirm"[^>]+type="password"[^>]+required/, signup, 'signup: password confirmation'],
  [/data-password-target="userPw"[^>]+aria-pressed="false"/, signup, 'signup: password visibility toggle'],
  [/data-password-target="userPwConfirm"[^>]+aria-pressed="false"/, signup, 'signup: confirmation visibility toggle'],
  [/id="emailLocal"/, signup, 'signup: email local input'],
  [/id="emailDomainSelect"[^]*?value="naver\.com"[^]*?value="gmail\.com"[^]*?value="custom"/, signup, 'signup: selectable and custom email domains'],
  [/id="emailDomainCustom"[^>]+hidden[^>]+disabled/, signup, 'signup: hidden custom domain input'],
  [/id="userEmail"\s+name="userEmail"\s+type="hidden"/, signup, 'signup: composed email field'],
  [/id="sendEmailCode"[^>]+type="button"[^>]*>\s*인증 번호 발송/, signup, 'signup: verification send button'],
  [/id="emailVerificationPanel"[^>]+hidden/, signup, 'signup: hidden verification panel'],
  [/id="emailVerificationTimer"[^>]*>03:00/, signup, 'signup: three-minute timer'],
  [/id="emailVerificationCode"[^>]+maxlength="8"/, signup, 'signup: verification code input'],
  [/SKALA4th[^]*?정상 인증 처리됩니다/, signup, 'signup: no-server practice guide'],
  [/id="emailSentPopup"[^>]+role="status"[^>]+hidden[^]*?이메일이 발송됐습니다\./, signup, 'signup: sent popup'],
  [/type="module"\s+src="\.\.\/script\/signupValidation\.js"/, signup, 'signup: validation module'],
  [/addEventListener\(['"]submit/, signupValidation, 'signup: submit validation'],
  [/event\.preventDefault\(\)/, signupValidation, 'signup: invalid submission block'],
  [/buildEmail/, signupValidation, 'signup: composed email generation'],
  [/validatePasswordConfirmation/, signupValidation, 'signup: password match validation'],
  [/togglePasswordVisibility/, signupValidation, 'signup: password visibility behavior'],
  [/showEmailSentPopup/, signupValidation, 'signup: non-blocking sent popup'],
  [/window\.setTimeout\(hideEmailSentPopup,\s*3000\)/, signupValidation, 'signup: popup auto close'],
  [/EMAIL_VERIFICATION_SECONDS/, signupValidation, 'signup: verification time limit'],
  [/window\.setInterval\(renderVerificationTimer,\s*1000\)/, signupValidation, 'signup: countdown interval'],
  [/window\.clearInterval\(verificationTimerId\)/, signupValidation, 'signup: countdown cleanup'],
  [/validateEmailVerificationCode/, signupValidation, 'signup: mock verification code validation'],
  [/isEmailVerified/, signupValidation, 'signup: verified state gate'],
  [/invalidateEmailVerification/, signupValidation, 'signup: changed email invalidation'],
  [/validatePassword/, signupRules, 'signup: password rule'],
  [/EMAIL_VERIFICATION_CODE\s*=\s*['"]SKALA4th['"]/, signupRules, 'signup: practice verification code'],
  [/EMAIL_VERIFICATION_SECONDS\s*=\s*180/, signupRules, 'signup: three-minute rule'],
  [/\.email-composer/, css, 'css: email composer layout'],
  [/\.password-toggle/, css, 'css: password visibility control'],
  [/\.verification-panel/, css, 'css: email verification panel'],
  [/\.sent-popup/, css, 'css: sent popup'],
  [/\.field-error/, css, 'css: inline validation feedback'],
  [/display:\s*flex/, css, 'css: Flexbox'],
  [/display:\s*grid/, css, 'css: Grid'],
  [/@import\s+url\(["']https:\/\/fonts\.googleapis\.com/, css, 'css: Google Font import'],
  [/body\s*{[^]*?font-family:\s*"Noto Sans KR"/, css, 'css: Google Font body application'],
  [/@media\s*\(max-width:\s*768px\)/, css, 'css: 768px media query'],
  [/@keyframes/, css, 'css: animation'],
  [/html\[data-theme="night"\]/, css, 'css: night theme'],
  [/--seoul-coral:\s*#f8496c/i, css, 'css: Seoulmate coral token'],
  [/--header-gradient:/, css, 'css: gradient hero token'],
  [/\.info-card:hover/, css, 'css: card hover elevation'],
  [/(?:Design|reference)\s+source:\s*pbjuni1007-cmyk\/seoulmate-pbjuni1007/i, css, 'css: design provenance'],
  [/id="theme-toggle"/, index, 'index: theme toggle'],
  [/localStorage/, theme, 'theme: Web Storage'],
  [/dataset\.theme/, theme, 'theme: data-theme state'],
  [/addEventListener\(['"]click/, theme, 'theme: click event'],
  [/aria-pressed/, theme, 'theme: accessible toggle state'],
  [/addEventListener\(['"]change/, realtime, 'js: change event'],
  [/textContent/, realtime, 'js: safe DOM update'],
  [/위도/, realtime, 'js: selected latitude display'],
  [/경도/, realtime, 'js: selected longitude display'],
  [/export\s+async\s+function/, weatherApi, 'js: exported async function'],
  [/fetch\(/, weatherApi, 'js: Fetch API'],
  [/response\.ok/, weatherApi, 'js: HTTP status check'],
  [/축하합니다![^]*?번 만에 맞추셨습니다\./, upDown, 'js: required Up-Down success message'],
  [/average\s*>=\s*60\s*\?\s*'합격입니다!'\s*:\s*'불합격입니다ㅠ'/, grade, 'js: personalized grade result labels'],
  [/`등급:\s*\$\{grade\}`/, grade, 'js: grade display']
];

for (const [pattern, source, label] of checks) {
  if (!pattern.test(source)) errors.push(`핵심 구현 누락: ${label}`);
}

for (const sensitiveId of ['userPw', 'userPwConfirm', 'emailVerificationCode']) {
  const inputTag = signup.match(new RegExp(`<input\\s+[^>]*id="${sensitiveId}"[^>]*>`))?.[0];
  if (!inputTag) {
    errors.push(`민감 입력 필드 누락: ${sensitiveId}`);
  } else if (/\sname=/.test(inputTag)) {
    errors.push(`GET URL 노출 위험: ${sensitiveId} input에 name 속성이 있으면 안 됨`);
  }
}

const rowspanCount = (classSchedule.match(/rowspan="2"/g) ?? []).length;
if (rowspanCount !== 5) errors.push(`시간표 셀 병합 오류: 월~금 마지막 2시간에 rowspan 5개 필요, 현재 ${rowspanCount}개`);

const tripCardCount = (trip.match(/<p class="trip-card">/g) ?? []).length;
if (tripCardCount !== 3) errors.push(`여행 카드 단락 오류: trip-card 3개 필요, 현재 ${tripCardCount}개`);

const tripMapCount = (trip.match(/<div class="trip-map-card">/g) ?? []).length;
if (tripMapCount !== 3) errors.push(`여행 지도 카드 오류: trip-map-card 3개 필요, 현재 ${tripMapCount}개`);

if (!/<th scope="row">17:00<br\s*\/?><small>~ 17:50<\/small><\/th>\s*<\/tr>/.test(classSchedule)) {
  errors.push('시간표 셀 병합 오류: 17:00 행에는 월~금 rowspan이 이어져야 함');
}

for (const startTime of ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']) {
  if (!classSchedule.includes(startTime)) errors.push(`시간표 교시 누락: ${startTime}`);
}

for (const file of htmlFiles) {
  const source = readFileSync(file, 'utf8');
  if (!/\.\.\/script\/theme\.js/.test(source)) errors.push(`테마 스크립트 연결 누락: ${file}`);

  const hasSharedFooter = /<footer class="site-footer">[^]*?mailto:pbjuni1007@gmail\.com[^]*?href="https:\/\/github\.com\/pbjuni1007-cmyk"\s+target="_blank"\s+rel="noopener noreferrer"[^]*?© 2026 SKALA 박병준\.[^]*?<\/footer>/.test(source);
  if (!hasSharedFooter) errors.push(`공통 footer 또는 GitHub 새 탭 속성 누락: ${file}`);

  if (!file.endsWith('/index.html')) {
    if (!/<p class="footer-return">\s*<a href="index\.html">← 메인 화면으로 돌아가기<\/a>\s*<\/p>/.test(source)) {
      errors.push(`메인 화면 복귀 링크 누락: ${file}`);
    }
    if (/포털로 돌아가기/.test(source)) errors.push(`이전 복귀 문구 잔존: ${file}`);
  }
}

for (const file of readdirSync(join(root, 'script')).filter((name) => name.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', join(root, 'script', file)], { encoding: 'utf8' });
  if (result.status !== 0) errors.push(`JavaScript 문법 오류: ${file}\n${result.stderr.trim()}`);
}

const combined = htmlFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
const placeholders = [...new Set(combined.match(/\[본인 [^\]]+\]/g) ?? [])];
if (placeholders.length > 0) warnings.push(`개인화 필요: ${placeholders.join(', ')}`);
if (/sample-(?:audio|video)\./.test(combined)) warnings.push('샘플 오디오·영상 참조를 본인 자료로 교체해야 함');
if (/placeholder-trip-/.test(combined)) warnings.push('placeholder 여행 이미지를 본인 자료로 교체해야 함');
if (/mailto:\[[^\]]+\]/.test(combined)) warnings.push('메일 링크 placeholder를 실제 이메일 주소로 교체해야 함');
if (/제출 전|sample-(?:audio|video)|placeholder-trip-/.test(mediaReadme)) {
  warnings.push('media/README.md가 현재 제출 미디어와 일치하지 않음');
}

if (strict && warnings.length > 0) errors.push(...warnings.map((warning) => `제출 준비 미완료: ${warning}`));

console.log(`기술 검사: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
console.log(`HTML ${htmlFiles.length}개, 필수 파일 ${requiredFiles.length}개, JavaScript 문법 검사 완료`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

process.exitCode = errors.length === 0 ? 0 : 1;
