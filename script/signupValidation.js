import {
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
} from './signupRules.js';

const form = document.querySelector('#signup-form');
const userId = document.querySelector('#userId');
const userPw = document.querySelector('#userPw');
const userPwConfirm = document.querySelector('#userPwConfirm');
const userName = document.querySelector('#userName');
const emailLocal = document.querySelector('#emailLocal');
const emailDomainSelect = document.querySelector('#emailDomainSelect');
const emailDomainCustom = document.querySelector('#emailDomainCustom');
const userEmail = document.querySelector('#userEmail');
const passwordToggles = [...document.querySelectorAll('.password-toggle')];
const sendEmailCode = document.querySelector('#sendEmailCode');
const verifyEmailCode = document.querySelector('#verifyEmailCode');
const emailVerificationPanel = document.querySelector('#emailVerificationPanel');
const emailVerificationCode = document.querySelector('#emailVerificationCode');
const emailVerificationTimer = document.querySelector('#emailVerificationTimer');
const emailVerificationState = document.querySelector('#emailVerificationState');
const emailVerificationError = document.querySelector('#email-verification-error');
const emailSentPopup = document.querySelector('#emailSentPopup');

let verificationTimerId = null;
let sentPopupTimerId = null;
let verificationExpiresAt = 0;
let verificationAddress = '';
let isEmailVerified = false;

function showFieldResult(input, errorElement, message) {
  input.setCustomValidity(message);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  errorElement.textContent = message;
  return !message;
}

function validateBasicField(input, errorId, validator) {
  const errorElement = document.querySelector(`#${errorId}`);
  return showFieldResult(input, errorElement, validator(input.value));
}

function validatePasswordField() {
  return validateBasicField(userPw, 'password-error', validatePassword);
}

function validatePasswordConfirmationField() {
  const message = validatePasswordConfirmation(userPw.value, userPwConfirm.value);
  return showFieldResult(
    userPwConfirm,
    document.querySelector('#password-confirm-error'),
    message
  );
}

function selectedDomain() {
  return emailDomainSelect.value === 'custom'
    ? emailDomainCustom.value
    : emailDomainSelect.value;
}

function validateEmail() {
  const errorElement = document.querySelector('#email-error');
  const localError = validateEmailLocal(emailLocal.value);
  const domainError = validateEmailDomain(selectedDomain());
  const message = localError || domainError;

  emailLocal.setCustomValidity(localError);
  emailDomainSelect.setCustomValidity(domainError);
  emailDomainCustom.setCustomValidity(emailDomainSelect.value === 'custom' ? domainError : '');
  emailLocal.setAttribute('aria-invalid', String(Boolean(localError)));
  emailDomainSelect.setAttribute('aria-invalid', String(Boolean(domainError)));
  emailDomainCustom.setAttribute(
    'aria-invalid',
    String(emailDomainSelect.value === 'custom' && Boolean(domainError))
  );

  errorElement.textContent = message;
  userEmail.value = message ? '' : buildEmail(emailLocal.value, selectedDomain());
  return !message;
}

function setVerificationState(message, state) {
  emailVerificationState.textContent = message;
  emailVerificationState.dataset.state = state;
  emailVerificationPanel.dataset.state = state;
}

function stopVerificationTimer() {
  if (verificationTimerId !== null) window.clearInterval(verificationTimerId);
  verificationTimerId = null;
}

function hideEmailSentPopup() {
  if (sentPopupTimerId !== null) window.clearTimeout(sentPopupTimerId);
  sentPopupTimerId = null;
  emailSentPopup.hidden = true;
}

function showEmailSentPopup() {
  hideEmailSentPopup();
  emailSentPopup.hidden = false;
  sentPopupTimerId = window.setTimeout(hideEmailSentPopup, 3000);
}

function expireEmailVerification() {
  stopVerificationTimer();
  verificationExpiresAt = 0;
  isEmailVerified = false;
  emailVerificationTimer.textContent = '00:00';
  emailVerificationCode.disabled = true;
  emailVerificationCode.required = false;
  verifyEmailCode.disabled = true;
  sendEmailCode.textContent = '인증 번호 재발송';
  showFieldResult(
    emailVerificationCode,
    emailVerificationError,
    '인증 시간이 만료되었습니다. 인증 번호를 다시 발송해 주세요.'
  );
  setVerificationState('인증 시간 만료', 'error');
}

function renderVerificationTimer() {
  const remainingSeconds = getRemainingSeconds(verificationExpiresAt);
  emailVerificationTimer.textContent = formatCountdown(remainingSeconds);
  if (remainingSeconds === 0) expireEmailVerification();
}

function startVerificationTimer() {
  stopVerificationTimer();
  verificationExpiresAt = Date.now() + EMAIL_VERIFICATION_SECONDS * 1000;
  renderVerificationTimer();
  verificationTimerId = window.setInterval(renderVerificationTimer, 1000);
}

function resetEmailVerification({ hidePanel = true, stateMessage = '인증 전' } = {}) {
  stopVerificationTimer();
  verificationExpiresAt = 0;
  verificationAddress = '';
  isEmailVerified = false;
  emailVerificationPanel.hidden = hidePanel;
  emailVerificationCode.value = '';
  emailVerificationCode.disabled = true;
  emailVerificationCode.required = false;
  emailVerificationCode.setCustomValidity('');
  emailVerificationCode.removeAttribute('aria-invalid');
  verifyEmailCode.disabled = true;
  emailVerificationTimer.textContent = '03:00';
  emailVerificationError.textContent = '';
  sendEmailCode.textContent = '인증 번호 발송';
  setVerificationState(stateMessage, stateMessage === '인증 전' ? 'idle' : 'error');
}

function invalidateEmailVerification() {
  const hadVerificationProgress = Boolean(
    verificationAddress || isEmailVerified || !emailVerificationPanel.hidden
  );
  if (!hadVerificationProgress) return;
  resetEmailVerification({
    stateMessage: '이메일이 변경되어 다시 인증해 주세요.'
  });
}

function handleEmailChange() {
  invalidateEmailVerification();
  validateEmail();
}

function toggleCustomDomain() {
  const usesCustomDomain = emailDomainSelect.value === 'custom';
  emailDomainCustom.hidden = !usesCustomDomain;
  emailDomainCustom.disabled = !usesCustomDomain;
  emailDomainCustom.required = usesCustomDomain;

  if (!usesCustomDomain) emailDomainCustom.value = '';
  handleEmailChange();
  if (usesCustomDomain) emailDomainCustom.focus();
}

function sendVerificationCode() {
  if (!validateEmail()) {
    form.querySelector('[aria-invalid="true"]:not(:disabled)')?.focus();
    return;
  }

  verificationAddress = userEmail.value;
  isEmailVerified = false;
  emailVerificationPanel.hidden = false;
  emailVerificationCode.value = '';
  emailVerificationCode.disabled = false;
  emailVerificationCode.required = true;
  emailVerificationCode.setCustomValidity('');
  emailVerificationCode.removeAttribute('aria-invalid');
  verifyEmailCode.disabled = false;
  emailVerificationError.textContent = '';
  sendEmailCode.textContent = '인증 번호 재발송';
  setVerificationState('인증번호 발송됨', 'pending');
  startVerificationTimer();

  // [추가 실습] 실제 전송 없이도 발송 → 입력 → 제한시간 → 완료 상태 흐름을 확인한다.
  showEmailSentPopup();
  emailVerificationCode.focus();
}

function verifyEmail() {
  if (getRemainingSeconds(verificationExpiresAt) === 0) {
    expireEmailVerification();
    return;
  }

  if (verificationAddress !== userEmail.value) {
    resetEmailVerification({
      stateMessage: '이메일이 변경되어 다시 인증해 주세요.'
    });
    sendEmailCode.focus();
    return;
  }

  const message = validateEmailVerificationCode(emailVerificationCode.value);
  if (!showFieldResult(emailVerificationCode, emailVerificationError, message)) return;

  isEmailVerified = true;
  stopVerificationTimer();
  emailVerificationTimer.textContent = '인증 완료';
  emailVerificationCode.disabled = true;
  emailVerificationCode.required = false;
  verifyEmailCode.disabled = true;
  setVerificationState('이메일 인증 완료', 'verified');
}

function validateEmailVerificationStatus() {
  const isCurrentAddressVerified = isEmailVerified && verificationAddress === userEmail.value;
  const message = isCurrentAddressVerified ? '' : '이메일 인증을 완료해 주세요.';
  emailVerificationError.textContent = message;

  if (!emailVerificationPanel.hidden) {
    emailVerificationCode.setCustomValidity(message);
    emailVerificationCode.setAttribute('aria-invalid', String(Boolean(message)));
  }
  if (message && emailVerificationState.dataset.state !== 'pending') {
    setVerificationState('이메일 인증 필요', 'error');
  }
  return !message;
}

function togglePasswordVisibility(button) {
  const input = document.querySelector(`#${button.dataset.passwordTarget}`);
  const shouldShow = input.type === 'password';
  const isConfirmation = input === userPwConfirm;

  input.type = shouldShow ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(shouldShow));
  button.setAttribute(
    'aria-label',
    `${isConfirmation ? '비밀번호 확인' : '비밀번호'} ${shouldShow ? '숨기기' : '보기'}`
  );
}

function resetPasswordVisibility() {
  for (const button of passwordToggles) {
    const input = document.querySelector(`#${button.dataset.passwordTarget}`);
    const isConfirmation = input === userPwConfirm;
    input.type = 'password';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute(
      'aria-label',
      `${isConfirmation ? '비밀번호 확인' : '비밀번호'} 보기`
    );
  }
}

function validateAll() {
  const emailIsValid = validateEmail();
  const results = [
    validateBasicField(userId, 'user-id-error', validateUserId),
    validatePasswordField(),
    validatePasswordConfirmationField(),
    emailIsValid,
    emailIsValid ? validateEmailVerificationStatus() : false,
    validateBasicField(userName, 'user-name-error', validateUserName)
  ];
  return results.every(Boolean);
}

if (form) {
  // [추가 실습] JavaScript가 실행되면 메시지를 직접 관리하고, 실행되지 않으면 HTML required가 대체합니다.
  form.noValidate = true;

  userId.addEventListener('input', () => validateBasicField(userId, 'user-id-error', validateUserId));
  userPw.addEventListener('input', () => {
    validatePasswordField();
    if (userPwConfirm.value) validatePasswordConfirmationField();
  });
  userPwConfirm.addEventListener('input', validatePasswordConfirmationField);
  userName.addEventListener('input', () => validateBasicField(userName, 'user-name-error', validateUserName));
  emailLocal.addEventListener('input', handleEmailChange);
  emailDomainSelect.addEventListener('change', toggleCustomDomain);
  emailDomainCustom.addEventListener('input', handleEmailChange);
  sendEmailCode.addEventListener('click', sendVerificationCode);
  verifyEmailCode.addEventListener('click', verifyEmail);
  for (const button of passwordToggles) {
    button.addEventListener('click', () => togglePasswordVisibility(button));
  }

  form.addEventListener('submit', (event) => {
    if (!validateAll()) {
      event.preventDefault();
      const firstInvalid = form.querySelector('[aria-invalid="true"]:not(:disabled):not([hidden])');
      (firstInvalid ?? sendEmailCode).focus();
      return;
    }

    // [추가 실습] 앞뒤 공백은 검증에만 쓰고 버리지 않으면 결과 URL에 남으므로 제출 직전에 정규화한다.
    userId.value = userId.value.trim();
    userName.value = userName.value.trim();
    emailLocal.value = emailLocal.value.trim();
    if (emailDomainSelect.value === 'custom') {
      emailDomainCustom.value = emailDomainCustom.value.trim().toLowerCase();
    }
    userEmail.value = buildEmail(emailLocal.value, selectedDomain());
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      emailDomainCustom.hidden = true;
      emailDomainCustom.disabled = true;
      emailDomainCustom.required = false;
      userEmail.value = '';
      hideEmailSentPopup();
      resetEmailVerification();
      resetPasswordVisibility();

      for (const input of form.querySelectorAll('[aria-invalid]')) {
        input.removeAttribute('aria-invalid');
        input.setCustomValidity('');
      }
      for (const error of form.querySelectorAll('.field-error')) error.textContent = '';
    }, 0);
  });

  window.addEventListener('pagehide', () => {
    stopVerificationTimer();
    hideEmailSentPopup();
  });
}
