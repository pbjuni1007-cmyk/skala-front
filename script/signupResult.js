const params = new URLSearchParams(window.location.search);

function setText(selector, value, fallback = '입력 없음') {
  const element = document.querySelector(selector);
  // query string도 외부 입력이므로 HTML 문자열이 아닌 textContent로 표시했습니다.
  if (element) element.textContent = value?.trim() || fallback;
}

setText('#result-name', params.get('userName'), '회원');
setText('#result-id', params.get('userId'));
setText('#result-email', params.get('userEmail'));
setText('#result-interests', params.getAll('interest').join(', '), '선택 없음');
