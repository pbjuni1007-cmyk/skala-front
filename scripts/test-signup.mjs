import assert from 'node:assert/strict';
import {
  EMAIL_VERIFICATION_CODE,
  EMAIL_VERIFICATION_SECONDS,
  buildEmail,
  formatCountdown,
  getRemainingSeconds,
  validateEmailDomain,
  validateEmailLocal,
  validateEmailVerificationCode,
  validatePassword,
  validatePasswordConfirmation,
  validateUserId,
  validateUserName
} from '../script/signupRules.js';

assert.equal(validateUserId('study01'), '', '영문·숫자 아이디는 허용해야 함');
assert.notEqual(validateUserId('abc'), '', '4자 미만 아이디는 거부해야 함');
assert.notEqual(validateUserId('학습자01'), '', '한글 아이디는 거부해야 함');

assert.equal(validatePassword('Study123!'), '', '영문·숫자·특수문자 비밀번호는 허용해야 함');
assert.notEqual(validatePassword('Study123'), '', '특수문자가 없는 비밀번호는 거부해야 함');
assert.notEqual(validatePassword('St1!'), '', '8자 미만 비밀번호는 거부해야 함');
assert.equal(validatePasswordConfirmation('Study123!', 'Study123!'), '', '같은 비밀번호 확인값은 허용해야 함');
assert.notEqual(validatePasswordConfirmation('Study123!', 'Study456!'), '', '다른 비밀번호 확인값은 거부해야 함');
assert.notEqual(validatePasswordConfirmation('Study123!', ''), '', '빈 비밀번호 확인값은 거부해야 함');

assert.equal(validateEmailLocal('pb.juni+study'), '', '허용된 이메일 로컬 문자는 통과해야 함');
assert.notEqual(validateEmailLocal('pb@juni'), '', '@가 포함된 로컬 입력은 거부해야 함');
assert.equal(validateEmailDomain('school.ac.kr'), '', '여러 단계 도메인은 허용해야 함');
assert.notEqual(validateEmailDomain('gmail'), '', '최상위 도메인이 없는 값은 거부해야 함');
assert.equal(buildEmail(' pbjuni ', 'GMAIL.COM'), 'pbjuni@gmail.com', '이메일을 정규화해 조합해야 함');

assert.equal(validateUserName('박병준'), '', '2자 이상 한글 이름은 허용해야 함');
assert.equal(validateUserName('Park Jun'), '', '공백을 포함한 영문 이름은 허용해야 함');
assert.notEqual(validateUserName('박'), '', '한 글자 이름은 거부해야 함');
assert.notEqual(validateUserName('박병준1'), '', '숫자가 포함된 이름은 거부해야 함');

assert.equal(EMAIL_VERIFICATION_CODE, 'SKALA4th', '교육용 인증번호가 안내 문구와 같아야 함');
assert.equal(EMAIL_VERIFICATION_SECONDS, 180, '인증 제한시간은 3분이어야 함');
assert.equal(validateEmailVerificationCode('SKALA4th'), '', '정확한 교육용 인증번호만 허용해야 함');
assert.notEqual(validateEmailVerificationCode('skala4th'), '', '대소문자가 다른 인증번호는 거부해야 함');
assert.notEqual(validateEmailVerificationCode(''), '', '빈 인증번호는 거부해야 함');
assert.equal(getRemainingSeconds(181_000, 1_000), 180, '만료 시각까지 남은 초를 계산해야 함');
assert.equal(getRemainingSeconds(1_000, 1_001), 0, '만료 후 남은 시간은 0이어야 함');
assert.equal(formatCountdown(180), '03:00', '3분을 MM:SS로 표시해야 함');
assert.equal(formatCountdown(9), '00:09', '한 자리 초를 두 자리로 표시해야 함');

console.log('회원가입 입력·인증 규칙 테스트: PASS');
