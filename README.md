# SKALA Front-end Practice Portal

HTML·CSS·JavaScript 수업에서 만든 페이지들을 하나의 개인 포털로 연결했습니다.

입과 전에는 Vue·Vuetify와 React를 사용하는 학생 프로젝트에서 프론트엔드를 담당했습니다.
이번에는 framework가 해주던 일을 잠시 내려놓고, HTML 구조와 순수 CSS, DOM API만으로 화면을 다시 만들어봤습니다. 예전 프로젝트의 코드를 가져오기보다는 그때 생긴 디자인 취향과 UI/UX 기준을 기초 문법으로 다시 표현하는 데 초점을 맞췄습니다.

과제 제출용으로 시작했지만, 만들다 보니 테마 전환부터 날씨 API, 회원가입 검증, 세로 영상 배치까지 이것저것 붙은 작은 놀이터가 됐습니다.

## 무엇을 만들었나

| 페이지 | 내용 | 주로 연습한 것 |
|---|---|---|
| 홈 | 각 실습으로 이동하는 개인 포털과 실시간 날씨 | Semantic HTML, DOM, Fetch API, ES Module |
| 프로필 | 자기소개와 관심 분야 | 목록, 강조 요소, 문서 구조 |
| 시간표 | 7월 20~24일 실제 강의 일정 | Table, `rowspan`, `colspan` |
| 휴일 | 개인적인 휴일 일과 | Block·Inline 요소, `mark`, `time` |
| 여행 | 여행 사진·지도·오디오·세로 영상 | Grid, `figure`, `iframe`, media element |
| 회원가입 | 입력 검증과 3분 이메일 모의 인증 | Form, Event, 상태 관리, 접근성 |
| 가입 결과 | GET Form 결과 표시 | Query string, `URLSearchParams`, `textContent` |

메인 화면에는 수업에서 만든 Up-Down 게임, 성적 계산기, 가방 목록도 함께 넣었습니다. 성적 계산기는 평균 60점의 합격 기준과 A~F 등급을 함께 보여줍니다. 각각 `prompt`, 조건문, 반복문, Array·Object를 다시 손에 익히기 위한 작은 실습입니다.

## 실행 방법

```bash
npm test
npm run readiness
npm run serve
```

브라우저에서 `http://localhost:8000/html/index.html`을 엽니다. ES Module과 Fetch API를 사용하므로 HTML 파일을 직접 열지 않고 로컬 HTTP 서버로 실행합니다.

## 이전 프로젝트 경험을 가져온 방식

- 참고 저장소: [pbjuni1007-cmyk/seoulmate-pbjuni1007](https://github.com/pbjuni1007-cmyk/seoulmate-pbjuni1007), 현재 private repo입니다.
- 참고 기준: commit `b965d46bbff3ff9fec77bf67e5b812f7877445a9`
- 참고 범위: `frontend/src/plugins/vuetify.js`, `frontend/src/pages/index.vue`, `frontend/src/components/common/AppHeader.vue`

Seoulmate의 Vue·Vuetify component나 로고·이미지를 가져오지는 않았습니다. 대신 제가 좋아했던 색상 계층, 둥근 card, 살짝 떠오르는 hover 느낌만 뽑아 이번 과제의 순수 CSS로 다시 만들었습니다.

| 이전 프로젝트의 디자인 원칙 | 이번 과제의 순수 CSS 구현 | 과제에 맞춘 변화 |
|---|---|---|
| Coral·Pink theme token | `--seoul-coral`, `--seoul-pink`, `--seoul-blush` | 본문 대비를 위해 버튼·링크에는 더 진한 파생색 사용 |
| 둥근 카드와 elevation | `border-radius`, `box-shadow` | Vuetify utility 없이 재작성 |
| Card hover motion | `transform: translateY()`와 transition | `prefers-reduced-motion` 환경에서는 동작 최소화 |
| Pill button·navigation | 공통 button과 `.site-nav` 스타일 | Semantic link·button의 역할과 focus 상태 유지 |
| 밝은 Landing Hero | CSS gradient와 장식 원형 | Seoulmate 이미지·로고 없이 개인 포털 문맥으로 변환 |
| 반응형 Grid | CSS Grid와 768px media query | framework grid 없이 HTML 7개에 공통 적용 |

낮 테마는 Seoulmate의 coral/pink/white 계열에서 시작했고, 밤 테마는 같은 색상 관계를 유지하면서 새로 만들었습니다. 다크모드를 좋아해서 추가한 기능이지만, 구현하면서 CSS 변수를 실제 상태 전환에 연결하는 연습도 됐습니다.

React·PWA 프로젝트에서 신경 썼던 반응형과 접근성 경험도 같이 가져왔습니다. 이 프로젝트에서는 `768px`을 모바일 전환 기준으로 잡았고, media query, skip link, `aria-live`, keyboard focus, `prefers-reduced-motion`도 함께 확인했습니다. React라면 공통 UI를 component로 먼저 분리했겠지만, 이번에는 여러 HTML 문서를 연결해보는 수업 목적에 맞춰 Multi-Page 구조를 유지했습니다.

| 이전에 익힌 관점 | 이번 과제에서 다시 해본 것 | 이유 |
|---|---|---|
| HTML 문서 구조 | `header`, `nav`, `main`, `article`, `aside`, `footer` | 화면 모양이 아니라 콘텐츠 역할이 코드에 드러나게 하기 위해 |
| CSS 선택자·변수 | Seoulmate 디자인 토큰을 순수 CSS 변수와 낮/밤 테마로 재구성 | 반복되는 색상을 한곳에서 관리하고 framework 밖에서도 확장하기 위해 |
| 외부 지도 연동 | 예전 프로젝트에서 외부 API로 지도를 붙여본 경험을 떠올려, 여행 사진 아래에 Google Maps `iframe`과 새 탭 링크를 배치 | 복잡한 API 연결을 다시 만드는 대신 사진과 실제 장소를 이어주는 데 집중하기 위해 |
| DOM event | inline event 대신 `addEventListener` | HTML 구조와 JavaScript 동작의 역할을 분리하기 위해 |
| Form 검증 | HTML 제약 조건을 기본 안전망으로 두고 JavaScript 규칙, 비밀번호 일치, 인증 상태와 필드별 메시지를 추가 | 사용자가 서버 응답을 기다리기 전에 입력 오류를 바로 고칠 수 있게 하기 위해 |
| 비동기 처리 | Fetch API를 별도 module로 분리 | 데이터 요청과 화면 갱신의 책임을 나누기 위해 |
| 반복 검증 | 정상 입력뿐 아니라 취소·오류·저장소 차단 분기도 검사 | 성공 화면 한 번만 보고 끝내지 않기 위해 |

## 구현하면서 고민한 부분

### GET Form에서 비밀번호가 URL에 노출될 수 있음

- 문제: 강의 요구대로 `method="get"`을 사용하면 `name`이 있는 비밀번호도 query string에 포함됩니다.
- 해결: 비밀번호 입력 연습은 유지하되 해당 input에는 `name`을 두지 않아 전송 대상에서 제외했습니다.
- 근거: `html/signUp.html`

### 프런트 검증만으로 회원정보를 신뢰할 수 없음

- 문제: JavaScript 검증은 빠른 사용자 안내에는 유용하지만, 사용자가 스크립트를 끄거나 요청을 직접 바꾸면 우회할 수 있습니다.
- 해결: 이 과제는 백엔드가 없는 교육용 페이지이므로 `required`와 JavaScript로 즉시 피드백을 연습했습니다. 실제 서비스에서는 같은 규칙을 백엔드에서 다시 검사하고, 아이디·이메일 중복 여부처럼 데이터베이스가 필요한 조건도 서버에서 최종 판단해야 합니다.
- 근거: `html/signUp.html`, `script/signupRules.js`, `signupValidation.js`

### 백엔드 없이 이메일 인증 흐름을 연습해야 함

- 문제: 메일 서버와 인증 API가 없으므로 실제 인증번호 발송·서버 저장·검증을 수행할 수 없습니다.
- 해결: 발송 팝업, 절대 만료 시각 기준 3분 카운트다운, 오답 거부, 정답 완료, 이메일 변경 시 인증 무효화를 프런트엔드 상태로 구현했습니다. 교육용 코드는 화면에 안내한 `SKALA4th`이며, 인증 전에는 회원가입 제출을 막습니다.
- 한계: 정답이 브라우저 상에 공개되어 있으므로 실제 보안 기능이 아닙니다. 실제 서비스에서는 서버가 일회용 코드를 생성·발송·만료·시도 횟수를 제한하고, 최종 인증 상태를 보관해야 합니다.
- 근거: `script/signupRules.js`, `signupValidation.js`

### Fetch API는 HTTP 오류에서 항상 reject되지 않음

- 문제: 네트워크 연결에 성공하면 400, 500번 대의 응답도 Promise가 fulfilled될 수 있습니다.
- 해결: `response.ok`를 별도로 검사하고 필요한 날씨 값도 숫자인지 확인했습니다.
- 근거: `script/weatherAPI.js`

### 외부 값을 HTML 문자열로 삽입할 때의 위험

- 문제: 검증되지 않은 문자열을 `innerHTML`로 삽입하면 의도하지 않은 HTML이 실행될 수 있습니다.
- 해결: element를 직접 만들고 `textContent`로 값을 넣었습니다.
- 근거: `script/realtimeInfo.js`, `signupResult.js`

### ES Module은 파일 직접 열기로 동작이 불안정함

- 문제: `file://` 환경에서는 module import와 네트워크 요청이 브라우저 정책에 막힐 수 있습니다.
- 해결: `npm run serve`로 로컬 HTTP 환경을 사용하도록 실행 절차를 고정했습니다.

### Vuetify 디자인을 과제 코드에 그대로 사용할 수 없음

- 문제: 이전 프로젝트의 화면은 Vue component와 Vuetify utility class에 의존하므로 그대로 가져오면 HTML·CSS 기초 실습 근거가 약해집니다.
- 해결: 색상 계층, 카드 elevation, pill button, hover motion만 디자인 원칙으로 추출하고 `css/style.css`에서 직접 다시 구현했습니다.
- 차이: 원본에 없던 밤 테마와 저장 상태, focus 상태, reduced motion까지 이번 과제에서 확장했습니다.

## 기본 실습에서 확장한 기능

수업에서 요구한 기능을 구현한 뒤, 실제로 사용하다가 아쉬웠던 부분을 조금씩 확장했습니다.

| 확장한 기능 | 추가한 이유 | 확인 방법 |
|---|---|---|
| 라이트/다크 모드와 상태 저장 | 제가 다크모드를 좋아하고, CSS 변수와 Web Storage를 함께 써보고 싶었습니다. | 테마 변경 후 새로고침 |
| 반응형 시간표와 여행 Grid | 작은 화면에서도 페이지 전체가 옆으로 밀리지 않게 했습니다. | 브라우저 폭을 768px 이하로 조절 |
| 여행 사진과 Google 지도 연결 | 사진만 놓고 보니 그 장소가 어디인지 감이 잘 오지 않아 산티아고 대성당, Midtown Manhattan, HKU Ricci Hall 위치를 함께 넣었습니다. | 지도를 움직여보고 `Google 지도에서 크게 보기` 새 탭 확인 |
| 비밀번호 확인·보기 | 입력 실수를 바로 확인하고 두 값의 일치 여부를 검사합니다. | 서로 다른 비밀번호 입력 |
| 이메일 도메인 선택·직접 입력 | 실제 회원가입 Form에서 자주 보는 입력 흐름을 만들어봤습니다. | `직접 입력` 선택 |
| 3분 이메일 모의 인증 | 백엔드 없이도 발송·입력·만료·완료의 상태 변화를 연습했습니다. | `SKALA4th` 오답·정답 입력 |
| 실시간 날씨 | DOM event, Fetch API, ES Module을 하나의 기능으로 연결했습니다. | 홈에서 도시 선택 |
| 성적 A~F 등급 분기 | 합격 여부만 보여주는 데서 끝내지 않고 같은 평균으로 등급도 계산했습니다. | 90·80·70·60·59점 입력 |
| 접근성 보완 | 마우스 외의 사용 방식과 상태 안내도 놓치지 않으려 했습니다. | Tab 이동, `aria-live`, reduced motion 확인 |
| 반복 검사 | 페이지가 늘어나면서 생길 수 있는 누락과 예외 분기를 다시 확인합니다. | `npm test` |

이메일 인증은 어디까지나 프런트엔드 상태 흐름을 확인하기 위한 모의 기능입니다. 실제 서비스라면 서버가 일회용 코드를 생성하고, 발송·만료·시도 횟수·최종 인증 상태를 관리해야 합니다.

## 미디어 기록

여행 페이지의 사진 세 장과 세로 영상은 개인 여행 기록을 사용했습니다. 영상은 브라우저에서 다루기 편하도록 720p H.264/AAC MP4로 정리했습니다. 오디오는 출처가 불분명한 외부 샘플을 남기지 않으려고 FFmpeg의 pink noise와 필터만으로 짧게 생성했습니다. 파일별 설명은 `media/README.md`에 적었습니다.

## 프로젝트 구조

```text
css/       공통 스타일과 낮/밤 테마
html/      포털과 개별 실습 페이지
media/     개인 이미지·영상과 직접 생성한 오디오
script/    JavaScript 실습과 ES Module
scripts/   자동 검증과 동작 테스트
```

## 강의 실습 항목 확인

README의 중심은 구현 경험에 두되, 수업에서 다룬 기초 요소가 어디에 사용됐는지는 아래에 따로 정리했습니다.

<details>
<summary>HTML·CSS·JavaScript 실습 항목 펼쳐보기</summary>

| 실습 항목 | 적용한 내용 | 위치 |
|---|---|---|
| 지정 제목과 환영 문장 | `Welcome SKALA`, `환영 인사`, `스칼라에 오신 것을 환영합니다.` | `html/index.html` |
| 여러 HTML 문서와 링크 | 홈·프로필·시간표·휴일·여행·회원가입·결과 페이지 | `html/` |
| 목록·표·Form·미디어 | `ul`, `ol`, `dl`, 셀 병합, 입력 Form, 이미지·오디오·비디오 | `html/` |
| External CSS와 Box Model | 공통 stylesheet, container, card, table, Form 디자인 | `css/style.css` |
| Flexbox·Grid·반응형 | 본문 배치, 여행 Grid, 768px mobile layout | `css/style.css` |
| JavaScript 기초 | Up-Down, 성적 계산기, Array·Object 가방 목록 | `script/upDown.js`, `grade.js`, `bag.js` |
| DOM·Event | 도시 선택, theme 전환, Form 입력 검증 | `script/realtimeInfo.js`, `theme.js`, `signupValidation.js` |
| Fetch API·ES Module | 날씨 요청과 화면 갱신 책임 분리 | `script/weatherAPI.js`, `realtimeInfo.js` |

</details>
