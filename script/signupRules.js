/* javascript 첫 연습으로 비밀번호 유효성 검사 스크립트 짜다가 머리가 많이 아팠습니다... */

const ID_PATTERN = /^[A-Za-z0-9]{4,15}$/;
const EMAIL_LOCAL_PATTERN = /^[A-Za-z0-9._%+-]+$/;
const DOMAIN_PATTERN = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
const NAME_PATTERN = /^[가-힣A-Za-z ]+$/;

export const EMAIL_VERIFICATION_CODE = 'SKALA4th';
export const EMAIL_VERIFICATION_SECONDS = 180;

export function validateUserId(value) {
  const normalized = value.trim();
  if (!normalized) return '아이디를 입력해 주세요.';
  if (!ID_PATTERN.test(normalized)) return '아이디는 4~15자의 영문 또는 숫자로 입력해 주세요.';
  return '';
}

export function validatePassword(value) {
  if (!value) return '비밀번호를 입력해 주세요.';
  if (value.length < 8 || value.length > 20) return '비밀번호는 8~20자로 입력해 주세요.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
    return '비밀번호에 영문, 숫자, 특수문자를 각각 1개 이상 포함해 주세요.';
  }
  return '';
}

export function validatePasswordConfirmation(password, confirmation) {
  if (!confirmation) return '비밀번호 확인을 입력해 주세요.';
  if (password !== confirmation) return '비밀번호가 서로 일치하지 않습니다.';
  return '';
}

export function validateEmailLocal(value) {
  const normalized = value.trim();
  if (!normalized) return '이메일 아이디를 입력해 주세요.';
  if (!EMAIL_LOCAL_PATTERN.test(normalized)) return '이메일 아이디에 사용할 수 없는 문자가 있습니다.';
  return '';
}

export function validateEmailDomain(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return '이메일 도메인을 선택하거나 입력해 주세요.';
  if (!DOMAIN_PATTERN.test(normalized)) return '도메인을 example.com 형식으로 입력해 주세요.';
  return '';
}

export function validateUserName(value) {
  const normalized = value.trim();
  if (!normalized) return '이름을 입력해 주세요.';
  if (normalized.length < 2 || normalized.length > 20) return '이름은 2~20자로 입력해 주세요.';
  if (!NAME_PATTERN.test(normalized)) return '이름은 한글 또는 영문으로 입력해 주세요.';
  return '';
}

export function buildEmail(local, domain) {
  const normalizedLocal = local.trim();
  const normalizedDomain = domain.trim().toLowerCase();
  if (validateEmailLocal(normalizedLocal) || validateEmailDomain(normalizedDomain)) return '';
  return `${normalizedLocal}@${normalizedDomain}`;
}

export function validateEmailVerificationCode(value) {
  if (!value.trim()) return '인증번호를 입력해 주세요.';
  if (value.trim() !== EMAIL_VERIFICATION_CODE) return '인증번호가 올바르지 않습니다.';
  return '';
}

export function getRemainingSeconds(expiresAt, now = Date.now()) {
  if (!Number.isFinite(expiresAt) || !Number.isFinite(now)) return 0;
  return Math.max(0, Math.ceil((expiresAt - now) / 1000));
}

export function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
